import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLID,
} from 'graphql';

export const UserType: GraphQLObjectType = new GraphQLObjectType({
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
  }),
});
