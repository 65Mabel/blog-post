import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/Credentials";

import User from "..///../../models/user.model";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Prinart",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "johndoe@email.com",
        },
        password: {
          type: "password",
          label: "password",
          placeholder: "please enter your password",
        },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        // checking if user is on the database
        let user = await User.findOne({ email });
        if (!user) {
          return null;
        }

        // checking if passwords match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        // returning the user
        return user;
      },
    }),
  ],
  calback: {
    jwt: ({ token, user }) => {
      if (token) {
        token.id = user._id;
        (token.firstName = user.firstName), (token.lastName = user.lastName);
      }

      return token;
    },
    session: ({ session }) => {
      session.id = token._id;
      session.firstName = token.firstName;
      session.lastName = token.lastName;

      return session;
    },
  },
  jwt: {
    secret: "password",
    encrypt: true,
  },
});
