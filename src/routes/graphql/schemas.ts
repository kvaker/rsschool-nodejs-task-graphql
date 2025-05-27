import { Type } from '@fastify/type-provider-typebox';
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
import { StatsType } from './types/stats.js';
import { statsResolvers } from './resolvers/stats.js';
import { MemberType } from './types/memberType.js';
import { memberTypeResolvers } from './resolvers/memberType.js';
import { PostType } from './types/post.js';
import { postResolvers } from './resolvers/post.js';

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
      posts: {
        type: new GraphQLList(PostType),
        resolve: postResolvers.Query.posts,
      },
      post: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: postResolvers.Query.post,
      },
      stats: {
        type: StatsType,
        resolve: statsResolvers.Query.stats,
      },
      memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: memberTypeResolvers.Query.memberTypes,
      },
      memberType: {
        type: MemberType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: memberTypeResolvers.Query.memberType,
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
      createPost: {
        type: PostType,
        args: {
          title: { type: new GraphQLNonNull(GraphQLString) },
          content: { type: new GraphQLNonNull(GraphQLString) },
          authorId: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: postResolvers.Mutation.createPost,
      },
      updatePost: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
          title: { type: GraphQLString },
          content: { type: GraphQLString },
        },
        resolve: postResolvers.Mutation.updatePost,
      },
      deletePost: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: postResolvers.Mutation.deletePost,
      },
    },
  }),
});

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const gqlResponseSchema = Type.Object({
  data: Type.Any(),
  errors: Type.Optional(Type.Array(Type.Any())),
});
