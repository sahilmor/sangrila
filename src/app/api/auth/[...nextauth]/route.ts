import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin & Accountant Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // Define allowed users
        const users = [
          { id: "1", name: "Admin", email: "admin@geeta.com", password: "admin@123", role: "admin" },
          { id: "2", name: "Accountant", email: "accounts@geeta.com", password: "accounts@123", role: "accountant" },
        ];

        // Find user by email and password
        const user = users.find((u) => u.email === credentials.email && u.password === credentials.password);

        if (user) {
          return user;
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role; // Assign role to session
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Store role in JWT token
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
