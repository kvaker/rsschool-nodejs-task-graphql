export const profileResolvers = {
  Query: {
    profiles: async (_parent, _args, { prisma }) => {
      return prisma.profile.findMany();
    },
    profile: async (_parent, { id }, { prisma }) => {
      return prisma.profile.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createProfile: async (_parent, args, { prisma }) => {
      return prisma.profile.create({
        data: args,
      });
    },
    updateProfile: async (_parent, { id, ...data }, { prisma }) => {
      return prisma.profile.update({
        where: { id },
        data,
      });
    },
    deleteProfile: async (_parent, { id }, { prisma }) => {
      await prisma.profile.delete({ where: { id } });
      return true;
    },
  },
};
