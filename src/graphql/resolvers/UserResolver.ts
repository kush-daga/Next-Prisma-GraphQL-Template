import { User } from "@prisma/client";
import { prisma } from "../../utils/prisma";
import { builder } from "../builder";

export const UserObject = builder.objectRef<User>("User").implement({
	fields: (t) => ({
		id: t.exposeID("id", {}),
		firstName: t.exposeString("firstName", {}),
		lastName: t.exposeString("lastName", {}),
		email: t.exposeString("email", {}),
		photoUrl: t.exposeString("photoUrl", {}),
	}),
});

builder.queryFields((t) => ({
	user: t.field({
		type: [UserObject],
		resolve: () => {
			return prisma.user.findMany();
		},
	}),
}));

const CreateUserInput = builder.inputType("CreateUserInput", {
	fields: (t) => ({
		firstName: t.string({ required: true }),
		lastName: t.string({ required: true }),
		email: t.string({ required: true }),
		photoUrl: t.string({ required: true }),
	}),
});

builder.mutationField("createUser", (t) =>
	t.field({
		type: UserObject,
		args: {
			input: t.arg({ type: CreateUserInput }),
		},
		resolve: (_root, { input }) => {
			return prisma.user.create({
				data: {
					email: input.email,
					firstName: input.firstName,
					lastName: input.lastName,
					photoUrl: input.photoUrl,
				},
			});
		},
	})
);
