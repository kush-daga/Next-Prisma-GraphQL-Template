import { PrismaClient } from "@prisma/client";
interface CustomNodeJsGlobal extends NodeJS.Global {
	prisma: PrismaClient;
}
// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient;
declare const global: CustomNodeJsGlobal;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}
export default prisma;
