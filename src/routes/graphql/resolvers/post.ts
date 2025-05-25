import { parseResolveInfoIfRequested } from '../utils/parseResolveInfo.js';

export const postResolvers = {
  Query: {
    posts: async (_parent, _args, { prisma, loaders }, info) => {
      const shouldIncludeAuthor = parseResolveInfoIfRequested(info, 'author');

      const posts = await prisma.post.findMany({
        include: shouldIncludeAuthor ? { author: true } : undefined,
      });

      if (shouldIncludeAuthor) {
        for (const post of posts) {
          loaders.postAuthor.prime(post.authorId, post.author);
        }
      }

      return posts;
    },

    post: async (_parent, { id }, { prisma }) => {
      return prisma.post.findUnique({ where: { id } });
    },
  },

  Mutation: {
    createPost: async (_parent, { title, content, authorId }, { prisma }) => {
      return prisma.post.create({
        data: { title, content, authorId },
      });
    },

    updatePost: async (_parent, { id, title, content }, { prisma }) => {
      return prisma.post.update({
        where: { id },
        data: { title, content },
      });
    },

    deletePost: async (_parent, { id }, { prisma }) => {
      return prisma.post.delete({ where: { id } });
    },
  },
};
