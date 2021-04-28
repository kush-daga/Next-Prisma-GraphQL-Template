//Just for testing need to change to apollo-client later..
import { gql } from "apollo-server-core";
import { UserQuery } from "./__generated__/Test.generated";

export const Test = () => {
	const userQuery = gql`
		query User {
			user {
				id
			}
		}
	`;

	const sthg: UserQuery = null;

	return <div>Hello</div>;
};
