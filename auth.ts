import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "@/src/db";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Founder Access",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "founder@velox.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        // 1. Find user in database with aggressive retry logic (DNS EAI_AGAIN protection)
        const MAX_RETRIES = 5;
        let user;
        for (let i = 0; i < MAX_RETRIES; i++) {
          try {
            user = await db.query.users.findFirst({
              where: eq(users.email, email),
            });
            break;
          } catch (error) {
            if (i === MAX_RETRIES - 1) throw error;
            const delay = Math.min(1000 * (i + 1), 3000); // Exponential backoff up to 3s
            console.warn(`Auth fetch attempt ${i + 1} failed. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }

        console.log(`Auth debug: User found for ${email}? ${!!user}`);

        // 2. Verify password if user exists
        if (user && user.password) {
          const isValid = await bcrypt.compare(password, user.password);
          console.log(`Auth debug: Password valid for ${email}? ${isValid}`);

          if (isValid) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
            };
          }
        }

        console.log(`Auth debug: Login failed for ${email}`);
        // Return null if authentication fails
        return null;
      }
    })
  ],
});
