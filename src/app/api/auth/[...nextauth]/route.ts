import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";

import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import { signInEmailPassword } from "@/auth/actions/authActions";


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,

    // Proveedores para auth
    providers: [

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),

        // PARA INICIAR SESIÓN CON GITHUB
        // GithubProvider({
        //     clientId: process.env.GITHUB_ID || '',
        //     clientSecret: process.env.GITHUB_SECRET || '',
        // }),

        // Proveedor User y Password
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "usuario@gmail.com" },
                password: { label: "Contraseña", type: "password", placeholder: "******" }
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const user = await signInEmailPassword(credentials?.email!, credentials?.password!)

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        })

    ],

    // Info de la sesion
    session: {
        strategy: 'jwt'
    },

    // esto pasa una vez se autentica el usuario en ese orden
    callbacks: {
        async signIn({ user, account, profile }) {
            const email = user.email;

            // Verificar si el usuario ya existe en la base de datos
            const existingUser = await prisma.user.findUnique({
                where: { email: email ?? 'no-email' },
            });

            if (existingUser) {
                // Si el usuario existe, enlaza la nueva cuenta (Google/GitHub) con el usuario existente
                return true; // Permitir el login
            }

            // Si el usuario no existe, permitir la creación de un nuevo registro en la base de datos
            return true;
        },

        async jwt({ token, user, account, profile }) {
            const dbUser = await prisma.user.findUnique({ where: { email: token.email ?? 'no-email' } });

            // Validacion para usuarios inactivos
            if (dbUser?.isActive === false) {
                throw Error("El usuario no esta activo")
            }

            token.roles = dbUser?.roles ?? ['no-roles']
            token.id = dbUser?.id ?? 'no-uuid'

            return token;
        },

        async session({ session, token, user }) {
            if (session && session.user) {
                session.user.roles = token.roles;
                session.user.id = token.id;
            }
            return session;
        }
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }