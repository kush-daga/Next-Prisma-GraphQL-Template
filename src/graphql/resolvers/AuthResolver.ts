import prisma from "../../utils/prisma";

import { hashPassword, authenticateUser } from "../../utils/auth";
import { createSession } from "../../utils/sessions";
import { builder } from "../builder";
import { UserObject } from "./UserResolver";

builder.queryFields(t => ({
  me: t.field({
    type: UserObject,
    authScopes: {
      user: true
    },
    nullable: true,
    resolve: (_root, _args, { user, session }) => {
      return user;
    }
  })
}));

builder.mutationField("logout", t =>
  t.boolean({
    authScopes: {
      user: true
    },
    resolve: async (_root, _args, { session }) => {
      await prisma.session.delete({ where: { id: session!.id } });
      return true;
    }
  })
);

const SignUpInput = builder.inputType("SignUpInput", {
  fields: t => ({
    name: t.string({ required: true }),
    email: t.string({ required: true }),
    password: t.string({ required: true })
  })
});

builder.mutationField("signUp", t =>
  t.field({
    type: UserObject,
    args: {
      input: t.arg({ type: SignUpInput })
    },
    authScopes: {
      unAuthenticated: true
    },
    resolve: async (_root, { input }, { req }) => {
      const user = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          hashedPassword: await hashPassword(input.password)
        }
      });
      await createSession(req, user);
      return user;
    }
  })
);

const LoginInput = builder.inputType("LoginInput", {
  fields: t => ({
    email: t.string({ required: true }),
    password: t.string({ required: true })
  })
});
builder.mutationField("login", t =>
  t.field({
    type: UserObject,
    args: {
      input: t.arg({ type: LoginInput })
    },
    authScopes: {
      isUnauthenticated: true
    },
    resolve: async (_root, { input }, { req }) => {
      console.log("CREATING USER");
      try {
        const user = await authenticateUser(input.email, input.password);
        await createSession(req, user);
        return user;
      } catch (err) {
        throw new Error(err);
      }
    }
  })
);
