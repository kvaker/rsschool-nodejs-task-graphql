import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { parse, validate, execute, specifiedRules } from 'graphql';
import depthLimit from 'graphql-depth-limit';

import { gqlSchema } from './schemas.js';
import { createUserFollowersLoader } from './loaders/userLoader.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/graphql',
    method: 'POST',
    schema: {
      body: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          variables: { type: 'object' },
        },
        required: ['query'],
      },
    },
    async handler(req) {
      const { query, variables } = req.body as {
        query: string;
        variables?: Record<string, unknown>;
      };

      const loaders = {
        userFollowers: createUserFollowersLoader(prisma),
      };

      const document = parse(query);
      const validationErrors = validate(
        gqlSchema,
        document,
        [...specifiedRules, depthLimit(5)]
      );

      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }

      const result = await execute({
        schema: gqlSchema,
        document,
        variableValues: variables,
        contextValue: {
          prisma,
          prismaStats: fastify.prismaStats,
          loaders,
        },
      });

      return result;
    },
  });
};

export default plugin;
