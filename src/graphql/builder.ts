import SchemaBuilder from "@giraphql/core";
import { User } from "@prisma/client";

export const builder = new SchemaBuilder<{
	Objects: {
		User: User;
	};
}>({});

builder.queryType({});
builder.mutationType({});
