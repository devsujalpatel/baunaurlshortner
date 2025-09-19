import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPasswordWithSalt } from "@/utils/hash";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing Email or Password");
        }

        try {
          const [existingUser] = await db
            .select({
              id: userTable.id,
              email: userTable.email,
              password: userTable.password,
              salt: userTable.salt,
            })
            .from(userTable)
            .where(eq(userTable.email, credentials.email));

          if (!existingUser) {
            throw new Error("User not found");
          }

          const { hashedPassword } = hashPasswordWithSalt(
            credentials.password,
            existingUser.salt
          );

          if (hashedPassword !== existingUser.password) {
            throw new Error("Incorrect Password");
          }

          // ✅ Must return a plain object with user info
          return {
            id: existingUser.id,
            email: existingUser.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
