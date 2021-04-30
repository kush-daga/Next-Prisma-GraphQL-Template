import SchemaBuilder from "@giraphql/core";
import { User, Session } from "@prisma/client";
import { IncomingMessage, OutgoingMessage } from "http";
import ScopeAuthPlugin from "@giraphql/plugin-scope-auth";
import ValidationPlugin from "@giraphql/plugin-validation";

export const builder = new SchemaBuilder<{
  DefaultInputFieldRequiredness: true;
  Context: {
    req: IncomingMessage;
    res: OutgoingMessage;
    user?: User | null;
    session?: Session | null;
  };
  Scalars: {
    DateTime: { Input: Date; Output: Date };
  };
  AuthScopes: {
    user: boolean;
    isUnauthenticated: boolean;
  };
}>({
  defaultInputFieldRequiredness: true,
  plugins: [ScopeAuthPlugin, ValidationPlugin],
  authScopes: async context => ({
    user: !!context.user,
    isUnauthenticated: !context.user
  })
});

builder.queryType({});
builder.mutationType({});

builder.scalarType("DateTime", {
  serialize: date => date.toISOString(),
  parseValue: date => {
    return new Date(date);
  }
});
