import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: "Query";
  me?: Maybe<User>;
  posts: Array<Post>;
};

export type QueryPostsArgs = {
  cursor?: Maybe<Scalars["String"]>;
  limit: Scalars["Int"];
};

export type User = {
  __typename?: "User";
  id: Scalars["Float"];
  username: Scalars["String"];
  email: Scalars["String"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type Post = {
  __typename?: "Post";
  id: Scalars["Float"];
  title: Scalars["String"];
  text: Scalars["String"];
  points: Scalars["Float"];
  creatorId: Scalars["Float"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  changePassword: UserResponse;
  forgetPassword: Scalars["Boolean"];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars["Boolean"];
  createPost: Post;
  updatePost?: Maybe<Post>;
  deletePost: Scalars["Boolean"];
};

export type MutationChangePasswordArgs = {
  newPassword: Scalars["String"];
  token: Scalars["String"];
};

export type MutationForgetPasswordArgs = {
  email: Scalars["String"];
};

export type MutationRegisterArgs = {
  input: UsernameEmailPassword;
};

export type MutationLoginArgs = {
  password: Scalars["String"];
  usernameOrEmail: Scalars["String"];
};

export type MutationCreatePostArgs = {
  input: InputPost;
};

export type MutationUpdatePostArgs = {
  input: InputPost;
  id: Scalars["Float"];
};

export type MutationDeletePostArgs = {
  id: Scalars["Float"];
};

export type UserResponse = {
  __typename?: "UserResponse";
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: "FieldError";
  field: Scalars["String"];
  message: Scalars["String"];
};

export type UsernameEmailPassword = {
  username: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
};

export type InputPost = {
  title: Scalars["String"];
  text: Scalars["String"];
};

export type RegularErrorFragment = { __typename?: "FieldError" } & Pick<
  FieldError,
  "field" | "message"
>;

export type RegularPostFragment = { __typename?: "Post" } & Pick<
  Post,
  "id" | "title" | "text" | "points" | "creatorId" | "createdAt" | "updatedAt"
>;

export type RegularUserFragment = { __typename?: "User" } & Pick<
  User,
  "id" | "username" | "email" | "createdAt" | "updatedAt"
>;

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars["String"];
  newPassword: Scalars["String"];
}>;

export type ChangePasswordMutation = { __typename?: "Mutation" } & {
  changePassword: { __typename?: "UserResponse" } & {
    errors?: Maybe<Array<{ __typename?: "FieldError" } & RegularErrorFragment>>;
    user?: Maybe<{ __typename?: "User" } & RegularUserFragment>;
  };
};

export type CreatePostMutationVariables = Exact<{
  input: InputPost;
}>;

export type CreatePostMutation = { __typename?: "Mutation" } & {
  createPost: { __typename?: "Post" } & RegularPostFragment;
};

export type ForgetPasswordMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type ForgetPasswordMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "forgetPassword"
>;

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
  login: { __typename?: "UserResponse" } & {
    errors?: Maybe<Array<{ __typename?: "FieldError" } & RegularErrorFragment>>;
    user?: Maybe<{ __typename?: "User" } & RegularUserFragment>;
  };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "logout"
>;

export type RegisterMutationVariables = Exact<{
  input: UsernameEmailPassword;
}>;

export type RegisterMutation = { __typename?: "Mutation" } & {
  register: { __typename?: "UserResponse" } & {
    errors?: Maybe<Array<{ __typename?: "FieldError" } & RegularErrorFragment>>;
    user?: Maybe<{ __typename?: "User" } & RegularUserFragment>;
  };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: "Query" } & {
  me?: Maybe<{ __typename?: "User" } & RegularUserFragment>;
};

export type PostsQueryVariables = Exact<{
  limit: Scalars["Int"];
  cursor?: Maybe<Scalars["String"]>;
}>;

export type PostsQuery = { __typename?: "Query" } & {
  posts: Array<{ __typename?: "Post" } & RegularPostFragment>;
};

export const RegularErrorFragmentDoc = gql`
  fragment RegularError on FieldError {
    field
    message
  }
`;
export const RegularPostFragmentDoc = gql`
  fragment RegularPost on Post {
    id
    title
    text
    points
    creatorId
    createdAt
    updatedAt
  }
`;
export const RegularUserFragmentDoc = gql`
  fragment RegularUser on User {
    id
    username
    email
    createdAt
    updatedAt
  }
`;
export const ChangePasswordDocument = gql`
  mutation ChangePassword($token: String!, $newPassword: String!) {
    changePassword(token: $token, newPassword: $newPassword) {
      errors {
        ...RegularError
      }
      user {
        ...RegularUser
      }
    }
  }
  ${RegularErrorFragmentDoc}
  ${RegularUserFragmentDoc}
`;

export function useChangePasswordMutation() {
  return Urql.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument);
}
export const CreatePostDocument = gql`
  mutation CreatePost($input: InputPost!) {
    createPost(input: $input) {
      ...RegularPost
    }
  }
  ${RegularPostFragmentDoc}
`;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(
    CreatePostDocument
  );
}
export const ForgetPasswordDocument = gql`
  mutation ForgetPassword($email: String!) {
    forgetPassword(email: $email)
  }
`;

export function useForgetPasswordMutation() {
  return Urql.useMutation<
    ForgetPasswordMutation,
    ForgetPasswordMutationVariables
  >(ForgetPasswordDocument);
}
export const LoginDocument = gql`
  mutation Login($usernameOrEmail: String!, $password: String!) {
    login(usernameOrEmail: $usernameOrEmail, password: $password) {
      errors {
        ...RegularError
      }
      user {
        ...RegularUser
      }
    }
  }
  ${RegularErrorFragmentDoc}
  ${RegularUserFragmentDoc}
`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
}
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument
  );
}
export const RegisterDocument = gql`
  mutation Register($input: UsernameEmailPassword!) {
    register(input: $input) {
      errors {
        ...RegularError
      }
      user {
        ...RegularUser
      }
    }
  }
  ${RegularErrorFragmentDoc}
  ${RegularUserFragmentDoc}
`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument
  );
}
export const MeDocument = gql`
  query Me {
    me {
      ...RegularUser
    }
  }
  ${RegularUserFragmentDoc}
`;

export function useMeQuery(
  options: Omit<Urql.UseQueryArgs<MeQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
}
export const PostsDocument = gql`
  query Posts($limit: Int!, $cursor: String) {
    posts(limit: $limit, cursor: $cursor) {
      ...RegularPost
    }
  }
  ${RegularPostFragmentDoc}
`;

export function usePostsQuery(
  options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
}
