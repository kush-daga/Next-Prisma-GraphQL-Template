import { GetServerSideProps } from "next";
import { authenticatedRoute } from "../src/utils/authenticatedRoute";
import { Session } from "@prisma/client";

export const getServerSideProps: GetServerSideProps = authenticatedRoute;

export default function Home({ session }: { session: Session }) {
  return (
    <div>
      {session && (
        <div>AUthenticated u are {session.createdAt.toISOString()} </div>
      )}
      <div>Hello Authenticated world</div>
    </div>
  );
}
