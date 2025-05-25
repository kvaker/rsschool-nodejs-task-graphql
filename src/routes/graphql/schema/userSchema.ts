import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
  GraphQLSchema,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';

export const createUserSchema = (prisma: any) => {
  const UserType: GraphQLObjectType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: new GraphQLNonNull(UUIDType) },
      name: { type: new GraphQLNonNull(GraphQLString) },
      balance: { type: new GraphQLNonNull(GraphQLFloat) },
      followers: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
        resolve: async (parent) => {
          return prisma.user.findMany({
            where: {
              subscribedToUser: {
                some: { authorId: parent.id },
              },
            },
          });
        },
      },
    }),
  });

  const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLList(new GraphQLNonNull(UserType)),
        resolve: () => prisma.user.findMany(),
      },
      user: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: (_, { id }) =>
          prisma.user.findUnique({ where: { id } }),
      },
    },
  });

  return new GraphQLSchema({
    query: QueryType,
    types: [UserType],
  });
};
