import { parseResolveInfo } from 'graphql-parse-resolve-info';
import type { GraphQLResolveInfo } from 'graphql';

export function parseResolveInfoIfRequested(info: GraphQLResolveInfo, field: string): boolean {
  const parsed = parseResolveInfo(info);
  if (!parsed || !parsed.fieldsByTypeName) return false;
  return Boolean(parsed.fieldsByTypeName['User']?.[field]);
}
