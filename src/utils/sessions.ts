import { Session, User } from "@prisma/client";
import { applySession, SessionOptions } from "next-iron-session";
import { IncomingMessage } from "http";
import { GetServerSidePropsContext } from "next";

import prisma from "./prisma";

export const sessionOptions: SessionOptions = {
  password: [{ id: 1, password: process.env.COOKIE_SECRET }],
  cookieName: "template-repo",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict"
  }
};

export const createSession = async (req: any, user: User) => {
  const session = await prisma.session.create({
    data: {
      userId: user.id
    }
  });

  await req.session.set("sessionID", session.id);
  await req.session.save();
  return session;
};

interface PrismaSession extends Session {
  user: User;
}

const sessionCache = new WeakMap<IncomingMessage, PrismaSession | null>();

export const resolveSession = async ({
  req,
  res
}: Pick<GetServerSidePropsContext, "req" | "res">) => {
  if (sessionCache.has(req)) {
    console.log("in cache");
    return sessionCache.get(req);
  }

  await applySession(req, res, sessionOptions);

  let session: PrismaSession | null = null;

  const sessionID = req.session.get("sessionID");

  if (sessionID) {
    session = await prisma.session.findUnique({
      where: { id: sessionID },
      include: {
        user: true
      }
    });
  }

  sessionCache.set(req, session);

  return session;
};
