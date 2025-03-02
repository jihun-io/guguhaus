// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    userId?: string;
    user?: {
      id?: string;
      userId?: string;
      name?: string | null;
    };
  }
}
