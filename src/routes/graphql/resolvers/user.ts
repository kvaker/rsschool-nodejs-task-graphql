import { parseResolveInfoIfRequested } from '../utils/parseResolveInfo.js';

export const userResolvers = {
  Query: {
    users: async (_parent, _args, { prisma, loaders }, info) => {
      const shouldIncludeFollowers = parseResolveInfoIfRequested(info, 'userSubscribedTo');
      const users = await prisma.user.findMany({
        include: shouldIncludeFollowers ? { userSubscribedTo: true } : undefined,
      });

      if (shouldIncludeFollowers) {
        for (const user of users) {
          loaders.userFollowers.prime(user.id, user.userSubscribedTo || []);
        }
      }

      return users;
    },

    user: async (_parent, { id }, { prisma }) => {
      return prisma.user.findUnique({ where: { id } });
    },
  },

  Mutation: {
    createUser: async (_parent, { name, balance }, { prisma }) => {
      return prisma.user.create({
        data: { name, balance },
      });
    },
  },

  User: {
  userSubscribedTo: (parent, _args, { loaders }) =>
    loaders.postAuthorLoader.load(parent.id),

  subscribedToUser: (parent, _args, { loaders }) =>
    loaders.userFollowersLoader.load(parent.id),
},
};
