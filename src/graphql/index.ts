import { printSchema, lexicographicSortSchema } from "graphql";
import fs from "fs";
import path from "path";
import { builder } from "../../src/graphql/builder";
import "./resolvers";

const schema = builder.toSchema({});
const schemaAsString = printSchema(lexicographicSortSchema(schema));

if (process.env.NODE_ENV === "development") {
	fs.writeFileSync(
		path.join(process.cwd(), "src/graphql/schema.gql"),
		schemaAsString
	);
}

export default schema;
