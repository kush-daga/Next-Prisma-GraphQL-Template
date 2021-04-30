import { User } from "@prisma/client";
import prisma from "../../utils/prisma";
import { createSession } from "../../utils/sessions";
import { builder } from "../builder";
import { authenticateUser, hashPassword } from "../../utils/auth";

export const UserObject = builder.objectRef<User>("User").implement({
  fields: t => ({
    id: t.exposeID("id", {}),
    name: t.exposeString("name", {}),
    email: t.exposeString("email", {})
  })
});

builder.queryFields(t => ({
  me: t.field({
    type: UserObject,
    nullable: true,
    resolve: (_root, _args, { user }) => {
      console.log(user);
      return user;
    }
  })
}));

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
