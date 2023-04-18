import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { DBGet, DBRun } from "@src/utils/DBHandler";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const user = (await res.json()).user;
        console.log(user);
        return user || null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 5000,
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      httpOptions: {
        timeout: 5000,
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account }) {
      if (account.provider === "github") {
        const res = await DBGet(
          "SELECT Identifier FROM Users WHERE Identifier = (?) AND GitHub = true",
          [account.providerAccountId]
        );
        if (res) return true;

        await DBRun(
          "INSERT INTO Users (Identifier, Password, Name, GitHub) VALUES (?,?,?,?)",
          [account.providerAccountId, "", "", true]
        ).catch((err) => {
          console.error(err);
        });
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.token,
          refreshToken: user.refreshToken,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.sub = token.sub;
      return session;
    },
  },
};

export default NextAuth(authOptions);
