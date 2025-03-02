import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    userId?: string;
    username?: string;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userId?: string;
      username?: string;
    };
  }
}
