import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLID,
} from 'graphql';

import { ProfileType } from './profile.js';
import { PostType } from './post.js';


export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    followers: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
      resolve: async (parent, _args, { loaders }) => {
        return loaders.userFollowers.load(parent.id);
      },
    },
    profile: {
  type: ProfileType,
  resolve: async (parent, _args, { prisma }) => {
    const profile = await prisma.profile.findUnique({
      where: { userId: parent.id },
    });

    return profile ?? null;
  },
},
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (parent, _args, { prisma }) => {
        return prisma.post.findMany({
          where: { authorId: parent.id },
        });
      },
    },
    userSubscribedTo: {
  type: new GraphQLList(UserType),
  resolve: async (parent, _args, { loaders }) => {
    const result = await loaders.userFollowers.load(parent.id);
    return result ?? [];
  },
},
subscribedToUser: {
  type: new GraphQLList(UserType),
  resolve: async (parent, _args, { prisma }) => {
    const subscriptions = await prisma.subscription.findMany({
      where: { subscribedToId: parent.id },
      include: { subscriber: true },
    });

    return subscriptions?.map((s) => s.subscriber) ?? [];
  },
},
  }),
});
