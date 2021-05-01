import { GetServerSideProps } from "next";
import { authenticatedRoute } from "../utils/authenticatedRoute";
import { Session } from "@prisma/client";
import { gql, useQuery } from "@apollo/client";
import { MeQuery } from "./__generated__/authenticated.generated";

export const getServerSideProps: GetServerSideProps = authenticatedRoute;

export default function Home({ session }: { session: Session }) {
  const query = gql`
    query Me {
      me {
        id
        email
        name
      }
    }
  `;

  const { loading, data, error } = useQuery<MeQuery>(query);

  return (
    <div>
      {loading && (
        <div>
          Loadinggg <br />
          <br />
        </div>
      )}

      {data && (
        <div>
          Hello {data?.me?.name}, You are logged in as {data?.me?.email}
        </div>
      )}
    </div>
  );
}
