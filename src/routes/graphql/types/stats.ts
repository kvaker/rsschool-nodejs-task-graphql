import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLScalarType,
} from 'graphql';

export const OperationType = new GraphQLObjectType({
  name: 'Operation',
  fields: {
    model: { type: GraphQLString },
    operation: { type: GraphQLString },
    args: { type: new GraphQLScalarType({ name: 'JSON', serialize: value => value }) },
  },
});

export const StatsType = new GraphQLObjectType({
  name: 'Stats',
  fields: {
    operationHistory: { type: new GraphQLList(OperationType) },
  },
});
