import { Post } from "../generated/graphql";

export const getNewCursor = (posts: Post[]) => {
  const lastPostIdx = posts.length - 1;
  let i = lastPostIdx;
  while (!posts[i]) {
    i -= 1;
  }
  return posts[i].createdAt;
};
