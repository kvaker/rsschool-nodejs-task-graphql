export const memberTypeResolvers = {
  Query: {
    memberTypes: async (_parent: unknown, _args: unknown, { prisma }) => {
      return prisma.memberType.findMany();
    },
    memberType: async (_parent: unknown, { id }: { id: string }, { prisma }) => {
      return prisma.memberType.findUnique({
        where: { id },
      });
    },
  },
};
