import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // ✅ Add role to session user
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string; // ✅ Add role to User type
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string; // ✅ Add role to JWT token
  }
}
