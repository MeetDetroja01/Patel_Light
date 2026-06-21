import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const USERS: Record<string, string> = {
  [process.env.AUTH_USER_1_NAME || "patellight"]: process.env.AUTH_USER_1_PASS || "patel@1234",
  [process.env.AUTH_USER_2_NAME || "admin"]: process.env.AUTH_USER_2_PASS || "light@5678",
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const expectedPass = USERS[credentials.username];
        if (expectedPass && expectedPass === credentials.password) {
          return { id: credentials.username, name: credentials.username };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.username = user.name;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.name = token.username as string;
      return session;
    },
  },
};
