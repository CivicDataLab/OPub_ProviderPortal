import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

const useSecureCookies = process.env.NEXTAUTH_URL.startsWith('https://');
const cookiePrefix = useSecureCookies ? '__Secure-' : '';
const hostName = new URL(process.env.NEXTAUTH_URL)?.hostname;

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    KeycloakProvider({
      clientId: `${process.env.KEYCLOAK_CLIENTID}`,
      clientSecret: `${process.env.KEYCLOAK_SECRET}`,
      issuer: `${process.env.KEYCLOAK_BASE_URL}/auth/realms/${process.env.KEYCLOAK_REALM}`,
      // httpOptions: {
      //   timeout: 8000,
      // },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.

      session.access = {
        token: token.access_token,
        // roles: userData.access || [],
      };

      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.access_token = account.access_token;
      }
      return token;
    },
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        domain: hostName == 'localhost' ? hostName : '.' + hostName, // add a . in front so that subdomains are included
      },
    },
  },
  secret: 'afsafasfsdfsdfsdfsd', //process.env.KEYCLOAK_SECRET,
};

export default NextAuth(authOptions);
