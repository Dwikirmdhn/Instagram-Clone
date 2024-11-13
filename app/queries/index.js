import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation Login($input: LoginInput) {
  login(input: $input) {
    access_token
    userId
    username
  }
}
`;

export const REGISTER = gql`
mutation Register($input: RegisterInput) {
  register(input: $input)
}
`;

export const GET_POSTS = gql`
query GetPosts {
  getPosts {
    Author {
      _id
      name
      username
      email
    }
    _id
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    content
    createdAt
    imgUrl
    likes {
      username
      createdAt
      updatedAt
    }
    tags
    updatedAt
  }
}
`

export const ADD_POST = gql`
mutation AddPost($input: AddPostInput) {
  addPost(input: $input) {
    Author {
      _id
      email
      name
      username
    }
    _id
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    content
    createdAt
    imgUrl
    likes {
      username
      createdAt
      updatedAt
    }
    tags
    updatedAt
  }
}
`

export const SEARCH_USERS = gql`
  query SearchUsers($input: SearchUserInput) {
    searchUsers(input: $input) {
      _id
      name
      username
      email
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query GetUserById($input: GetUserByIdInput) {
  getUserById(input: $input) {
    Followers {
      username
      _id
      name
      email
    }
    Followings {
      _id
      username
      email
      name
    }
    _id
    email
    name
    username
  }
}
`;

export const GET_POST_BY_ID = gql`
query GetPostById($input: GetPostByIdInput) {
  getPostById(input: $input) {
    Author {
      _id
      email
      name
      username
    }
    _id
    authorId
    comments {
      content
      username
    }
    content
    imgUrl
    likes {
      username
    }
    tags
    createdAt
    updatedAt
  }
}
`

export const LIKE_OR_UNLIKE_POST = gql`
  mutation LikePost($input: LikeInput) {
    likePost(input: $input)
  }
`;

export const COMMENT_POST = gql`
  mutation CommentPost($input: CommentInput) {
    commentPost(input: $input)
  }
`;

export const FOLLOW_OR_UNFOLLOW_USER = gql`
  mutation FollowUser($input: FollowInput) {
    followUser(input: $input)
  }
`;