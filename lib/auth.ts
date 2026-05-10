import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"




const BACKEND_URL = process.env.NEXT_BACKEND_URL || "http://localhost:5000/api"

export const authOptions: NextAuthConfig = {
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60   // 30 days
    },

    providers: [
        // ─── Credentials Provider ───────────────────────────────────────────────
        // API: POST /api/auth/login → { email, password } → returns { user, token }
        // BACKEND: controllers/authController.js → login()
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required")
                }

                try {
                    const response = await fetch(`${BACKEND_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        })
                    })

                    if (!response.ok) {
                        if (response.status == 401) {
                            throw new Error("Invalid email or password");
                        }
                        throw new Error("Authentication failed");
                    }

                    const data = await response.json()

                    if (data.user && data.token) {
                        return {
                            id: data.user.id,
                            name: data.user.first_name + " " + data.user.last_name,
                            email: data.user.email,
                            role: data.user.role,
                            accessToken: data.token
                        } as any
                    }

                    throw new Error("Invalid response from server");

                } catch (error: any) {
                    throw new Error(error?.message || "Authentication failed");
                }
            }
        }),
    ],

    callbacks: {
        async signIn({ user, account }: any) {
            return true
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
                token.accessToken = (user as any).accessToken
            }

            return token
        },
        async session({ session, token }: any) {
            if (session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).role = token.role;
                (session.user as any).accessToken = token.accessToken;
            }
            return session;
        },

    }
}
