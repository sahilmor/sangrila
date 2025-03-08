import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // Simulate a database check (Replace with actual DB lookup)
        if (credentials.email === "admin@example.com" && credentials.password === "admin123") {
          return { id: "1", name: "Admin", email: credentials.email, role: "admin" };
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role; // ✅ Assign role to session user
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // ✅ Store role in JWT token
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

// ✅ Correctly Export NextAuth Handlers
export { handler as GET, handler as POST };
