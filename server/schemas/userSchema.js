const { ObjectId } = require("mongodb");
const { hashPassword, comparePassword } = require("../helpers/bcryptjs");
const { signToken } = require("../helpers/jsonwebtoken");
const { GraphQLError } = require("graphql");

const userTypeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    password: String!
  }

  input SearchUserInput {
    keyword: String!
  }

  input GetUserByIdInput {
    userId: String!
  }

  type GetUserByIdResponse {
    _id: ID!
    name: String
    username: String!
    email: String!
    Followings: [User]
    Followers: [User]
  }

  input RegisterInput {
    name: String
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type LoginResponse {
    access_token: String!
    userId: String
    username: String!
  }

  type Query {
    searchUsers(input: SearchUserInput): [User]
    getUserById(input: GetUserByIdInput): GetUserByIdResponse
  }

  type Mutation {
    register(input: RegisterInput): String
    login(input: LoginInput) : LoginResponse
  }
`;

const userResolvers = {
    Query: {
        searchUsers: async (_, args, context) => {
            try {
                const { db } = context;
                const { keyword } = args.input;
                const query = {
                    $or: [
                        { name: { $regex: keyword, $options: "i" } },
                        { username: { $regex: keyword, $options: "i" } },
                    ],
                };

                const users = await db.collection("Users").find(query).toArray();

                return users;
            } catch (error) {
                throw error;
            }
        },

        getUserById: async (_, args, context) => {
            try {
                await context.authenticate();
                const { db } = context;
                const { userId } = args.input;

                const stages = [
                    {
                        $match: {
                            _id: new ObjectId(userId),
                        },
                    },
                    {
                        $lookup: {
                            from: "Follows",
                            localField: "_id",
                            foreignField: "followerId",
                            as: "Followings",
                        },
                    },
                    {
                        $lookup: {
                            from: "Users",
                            localField: "Followings.followingId",
                            foreignField: "_id",
                            as: "Followings",
                        },
                    },
                    {
                        $lookup: {
                            from: "Follows",
                            localField: "_id",
                            foreignField: "followingId",
                            as: "Followers",
                        },
                    },
                    {
                        $lookup: {
                            from: "Users",
                            localField: "Followers.followerId",
                            foreignField: "_id",
                            as: "Followers",
                        },
                    },
                    {
                        $project: {
                            password: 0,
                            "Followings.password": 0,
                            "Followers.password": 0,
                        },
                    },
                ];

                const user = await db.collection("Users").aggregate(stages).next();

                console.log(user);

                return user;
            } catch (error) {
                throw error;
            }
        },
    },

    Mutation: {
        register: async (_, args, context) => {
            try {
                const { db } = context;
                const { name, username, email, password } = args.input;

                // Unique username validation
                const findUserByUsername = await db
                    .collection("Users")
                    .findOne({ username });

                if (findUserByUsername) {
                    throw new GraphQLError("Username has already been taken", {
                        extensions: {
                            http: { status: 400 },
                        },
                    });
                }

                // Unique email validation
                const findUserByEmail = await db.collection("Users").findOne({ email });

                if (findUserByEmail) {
                    throw new GraphQLError("Email has already been registered", {
                        extensions: {
                            http: { status: 400 },
                        },
                    });
                }

                // Email format validation
                const validateEmailFormat = (email) => {
                    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return re.test(String(email).toLowerCase());
                };

                if (!validateEmailFormat(email)) {
                    throw new GraphQLError("Invalid email", {
                        extensions: {
                            http: { status: 400 },
                        },
                    });
                }

                // Password length validation
                if (password.length < 5) {
                    throw new GraphQLError("Password must at least has 5 characters", {
                        extensions: {
                            http: { status: 400 },
                        },
                    });
                }

                // Passed all validation
                const registerInput = {
                    name,
                    username,
                    email,
                    password: hashPassword(password),
                };

                await db.collection("Users").insertOne(registerInput);

                return "Registered";
            } catch (error) {
                throw error;
            }
        },

        login: async (_, args, context) => {
            try {
                const { db } = context;
                const { username, password } = args.input;

                const user = await db.collection("Users").findOne({ username });

                if (!user) {
                    throw new GraphQLError("Invalid Username or Password", {
                        extensions: {
                            http: { status: 401 },
                        },
                    });
                }

                if (!comparePassword(password, user.password)) {
                    throw new GraphQLError("Invalid Username or Password", {
                        extensions: {
                            http: { status: 401 },
                        },
                    });
                }

                const payload = {
                    userId: user["_id"],
                    name: user.name,
                    username: user.username,
                    email: user.email,
                };

                const access_token = signToken(payload);

                return {
                    message: "Login Successfully",
                    access_token,
                    userId: payload.userId,
                    username: user.username
                };
            } catch (error) {
                throw error;
            }
        },
    },
};

module.exports = { userTypeDefs, userResolvers };