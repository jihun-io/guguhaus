import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { adminDb } from "@/app/lib/firebaseAdmin";
import { compare } from "bcryptjs";

interface CustomUser extends User {
  userId: string;
  username: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.userId || !credentials?.password) {
          throw new Error("아이디와 비밀번호를 입력해주세요");
        }

        const usersSnapshot = await adminDb
          .collection("users")
          .where("userId", "==", credentials.userId)
          .limit(1)
          .get();

        if (usersSnapshot.empty) {
          throw new Error("아이디 또는 비밀번호가 일치하지 않습니다");
        }

        const userDoc = usersSnapshot.docs[0];
        const userData = userDoc.data();

        const isValid = await compare(credentials.password, userData.password);

        if (!isValid) {
          throw new Error("아이디 또는 비밀번호가 일치하지 않습니다");
        }

        return {
          id: userDoc.id,
          userId: userData.userId,
          username: userData.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userId = (user as CustomUser).userId;
        token.username = (user as CustomUser).username; // username 속성 추가
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.userId = token.userId as string;
        session.user.username = token.username as string; // username 속성 추가
      }
      return session;
    },
  },
  pages: {
    signIn: "/administrator/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
