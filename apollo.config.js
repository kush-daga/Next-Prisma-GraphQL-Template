module.exports = {
	client: {
		includes: ["./src/**/*.tsx"],
		service: {
			name: "testing-prisma",
			localSchemaFile: "./src/graphql/schema.gql",
		},
	},
};
