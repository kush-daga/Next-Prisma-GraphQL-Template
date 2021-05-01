import { withIronSession } from "next-iron-session";
import { sessionOptions } from "./sessions";
import { GetServerSidePropsContext } from "next";

import prisma from "./prisma";

export const unAuthenticatedRoute = withIronSession(
  async ({ req, res }: GetServerSidePropsContext) => {
    const sessionID = req.session.get("sessionID");

    const session = await prisma.session.findUnique({
      where: { id: sessionID }
    });

    if (session) {
      res.setHeader("location", "/");
      res.statusCode = 302;
      res.end();
      return { props: { session } };
    }

    return {
      props: {}
    };
  },
  sessionOptions
);
