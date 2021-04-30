import { withIronSession } from "next-iron-session";
import { sessionOptions } from "./sessions";
import { IncomingMessage } from "http";
import { OutgoingMessage } from "http";
import { GetServerSideProps } from "next";
import { GetServerSidePropsContext } from "next";
import prisma from "./prisma";

export const authenticatedRoute = withIronSession(
  async ({ req, res }: GetServerSidePropsContext) => {
    const sessionID = req.session.get("sessionID");

    const session = await prisma.session.findUnique({
      where: { id: sessionID }
    });

    if (!session) {
      res.setHeader("location", "/login");
      res.statusCode = 302;
      res.end();
      return { props: {} };
    }

    return {
      props: { session }
    };
  },
  sessionOptions
);
