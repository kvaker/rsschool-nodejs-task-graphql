import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';

import { parse, validate, execute, specifiedRules } from 'graphql';
import depthLimit from 'graphql-depth-limit';

import { gqlSchema } from './schemas.js';
import { createUserLoader } from './loaders/userLoader.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;

      const loaders = {
        user: createUserLoader(prisma),
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
          loaders,
        },
      });

      return result;
    },
  });
};

export default plugin;
