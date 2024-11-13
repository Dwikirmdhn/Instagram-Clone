const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongo-connection");
const { GraphQLError } = require("graphql");

const followTypeDefs = `#graphql
  type Follow {
      _id: ID
      followingId: ID
      followerId: ID
      createdAt: String
      updatedAt: String
  }

  input FollowInput {
    followingId: String
  }

  type Mutation {
    followUser(input: FollowInput): String
  }
`;

const followResolvers = {
    Mutation: {
        followUser: async (_, args, context) => {
            try {
                const userInfo = await context.authenticate();
                const { followingId } = args.input;
                const { db } = context;

                const followerId = new ObjectId(userInfo.userId);
                const followInput = {
                    followingId: new ObjectId(followingId),
                    followerId,
                };

                // Check if the user is already following
                const existingFollow = await db
                    .collection("Follows")
                    .findOne(followInput);

                if (existingFollow) {
                    // If already following, unfollow (remove the record)
                    await db.collection("Follows").deleteOne(followInput);
                    return "Unfollow success";
                } else {
                    // If not following, create a new follow record
                    const followData = {
                        ...followInput,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };

                    const followReport = await db
                        .collection("Follows")
                        .insertOne(followData);

                    const follow = await db
                        .collection("Follows")
                        .findOne({ _id: new ObjectId(followReport.insertedId) });

                    return "Succes Follow";
                }
            } catch (error) {
                throw error;
            }
        },
    },
};

module.exports = { followTypeDefs, followResolvers };