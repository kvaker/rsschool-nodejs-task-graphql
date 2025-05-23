import { GraphQLResolveInfo } from 'graphql';
import { parseResolveInfoIfRequested } from '../utils/parseResolveInfo.js';

export const userResolvers = {
  Query: {
    users: async (_, __, { prisma, loaders }) => {
      const users = await prisma.user.findMany();
      users.forEach((user) => loaders.user.prime(user.id, user));
      return users;
    },
    user: async (_, { id }, { loaders }) => {
      return loaders.user.load(id);
    },
  },
  Mutation: {
    createUser: async (_, args, { prisma }) => {
      return prisma.user.create({ data: args });
    },
  },
  User: {
    followers: async (parent, _, { prisma }, info: GraphQLResolveInfo) => {
      const shouldResolve = parseResolveInfoIfRequested(info, 'followers');
      if (!shouldResolve) return [];

      const subs = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: parent.id },
        include: { subscriber: true },
      });

      return subs.map((s) => s.subscriber);
    },
  },
};
