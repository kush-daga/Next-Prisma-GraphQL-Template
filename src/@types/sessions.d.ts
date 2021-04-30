declare module "http" {
	interface IncomingMessage {
		session: import("next-iron-session").Session;
	}
}
