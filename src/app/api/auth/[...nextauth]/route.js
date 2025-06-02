import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// ✅ Export this so server components can import it
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
};

// ✅ Use it in NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
