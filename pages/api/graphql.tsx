import { ApolloServer } from "apollo-server-micro";
import { PrismaClient } from "@prisma/client";
import schema from "../../src/graphql/index";

export const config = {
	api: {
		bodyParser: false,
	},
};

const server = new ApolloServer({
	schema,
});

export default server.createHandler({ path: "/api/graphql" });
