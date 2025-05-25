import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLID,
} from 'graphql';

import { UUIDType } from './types/uuid.js';
import { UserType } from './types/user.js';
import { userResolvers } from './resolvers/user.js';
import { ProfileType } from './types/profile.js';
import { profileResolvers } from './resolvers/profile.js';

export const gqlSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(UserType),
        resolve: userResolvers.Query.users,
      },
      user: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: userResolvers.Query.user,
      },
      profiles: {
        type: new GraphQLList(ProfileType),
        resolve: profileResolvers.Query.profiles,
      },
      profile: {
        type: ProfileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: profileResolvers.Query.profile,
      },
    },
  }),

  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: UserType,
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          balance: { type: new GraphQLNonNull(GraphQLFloat) },
        },
        resolve: userResolvers.Mutation.createUser,
      },

      createProfile: {
        type: ProfileType,
        args: {
          isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
          yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
          userId: { type: new GraphQLNonNull(GraphQLID) },
          memberTypeId: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_parent, args, context) => {
          const { prisma } = context;
          return prisma.profile.create({ data: args });
        },
      },
    },
  }),
});
