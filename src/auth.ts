import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifySignature } from "./lib/auth-helper";
import prisma from "./lib/db";

type User = {
  id: string;
  publicKey: string;
  name: string;
  email: string;
  isKyced: boolean;
};

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      publickey: string | null;
      isKyced: boolean;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      name: "sol-auth",
      credentials: {
        signature: {
          label: "Signature",
          type: "text",
        },
        publicKey: {
          label: "Public Key",
          type: "text",
        },
        redirect: {
          label: "Redirect",
          type: "text",
        },
        csrfToken: {
          label: "CSRF Token",
          type: "text",
        },
        callbackUrl: {
          label: "Callback URL",
          type: "text",
        },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) {
          return null;
        }
        const { signature, publicKey, csrfToken } = credentials;

        const message = `By signing this message, you are logging into ${process.env.NEXT_PUBLIC_APP_NAME}\n${csrfToken}`;
        const nonce = new TextEncoder().encode(message);

        const isValid = verifySignature(
          signature as string,
          publicKey as string,
          nonce
        );

        if (!isValid) {
          throw new Error("Invalid signature");
        }

        let user = await prisma.user.findUnique({
          where: {
            id: publicKey as string,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              id: publicKey as string,
            },
          });
        }

        return {
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          publicKey: user.id,
          isKyced: user.isKyced,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      // console.log({ session, token });
      // console.log({ session, user, token });
      if (token) {
        session.user.name = token.name || "";
        session.user.email = token.email || "nomail@gmail.com";
        session.user.id = token.id as string;
        session.user.publickey = token.sub || null;
        session.user.image = `https://ui-avatars.com/api/?name=${token.sub}`;
      }
      // console.log({ session });
      return session;
    },
    jwt: async ({ token, user, account, profile }) => {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = token.sub || profile?.sub;
      }
      if (user) {
        token.user = {
          _id: user.id,
          name: user.name,
          email: user.email,
          publicKey: user.id,
        };
      }

      return token;
    },
  },
});
