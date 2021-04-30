import { GetServerSideProps } from "next";
import { authenticatedRoute } from "../src/utils/authenticatedRoute";

export const getServerSideProps: GetServerSideProps = authenticatedRoute;

export default function Home({ session }) {
  return (
    <div>
      {session && <div>AUthenticated u are</div>}
      <div>Hello Authenticated world</div>
    </div>
  );
}
