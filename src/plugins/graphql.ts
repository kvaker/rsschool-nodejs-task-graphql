import { graphql } from 'graphql';
import { gqlSchema } from '../routes/graphql/schemas.js';
import { FastifyPluginAsync } from 'fastify';

const graphqlRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post('/graphql', async (request, reply) => {
    const { query, variables, operationName } = request.body as {
      query: string;
      variables?: Record<string, any>;
      operationName?: string;
    };

    const result = await graphql({
      schema: gqlSchema,
      source: query,
      variableValues: variables,
      operationName,
      contextValue: {
        prisma: fastify.prisma,
      },
    });

    return result;
  });
};

export default graphqlRoute;
