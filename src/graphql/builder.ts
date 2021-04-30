import SchemaBuilder from "@giraphql/core";
import { User, Session } from "@prisma/client";
import { IncomingMessage, OutgoingMessage } from "http";
import ScopeAuthPlugin from "@giraphql/plugin-scope-auth";
import ValidationPlugin from "@giraphql/plugin-validation";

export const builder = new SchemaBuilder<{
  DefaultInputFieldRequiredness: true;
  Objects: {
    User: User;
  };
  Context: {
    req: IncomingMessage;
    res: OutgoingMessage;
    user?: User;
  };
  AuthScopes: {
    user: boolean;
  };
}>({
  plugins: [ValidationPlugin, ScopeAuthPlugin],
  authScopes: async ({ req, res, user }) => {
    return { user: !!user };
  },
  defaultInputFieldRequiredness: true
});

builder.queryType({});
builder.mutationType({});
