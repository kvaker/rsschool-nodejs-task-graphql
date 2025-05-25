export const statsResolvers = {
  Query: {
    stats: async (_parent: unknown, _args: unknown, { prismaStats }: any) => {
      return prismaStats;
    },
  },
};
