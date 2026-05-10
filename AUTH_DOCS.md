# ClinicApp — Complete Auth System Documentation

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [File-by-File Breakdown](#2-file-by-file-breakdown)
3. [Registration Flow](#3-registration-flow)
4. [Login Flow](#4-login-flow)
5. [Session & JWT Lifecycle](#5-session--jwt-lifecycle)
6. [Route Protection (Middleware)](#6-route-protection-middleware)
7. [API Calls After Login (Axios)](#7-api-calls-after-login-axios)
8. [Complete End-to-End Flow Chart](#8-complete-end-to-end-flow-chart)
9. [Route Access Matrix](#9-route-access-matrix)
10. [Environment Variables](#10-environment-variables)
11. [Common Errors & Fixes](#11-common-errors--fixes)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│  React Components → useSession() / signIn() / signOut()     │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP requests
         ┌───────────▼───────────┐
         │  NEXT.JS SERVER       │
         │                       │
         │  proxy.ts             │  ← runs FIRST on every request
         │  (middleware/proxy)   │  ← decides: allow, redirect, block
         │                       │
         │  app/api/auth/        │  ← Auth.js route handler
         │  [...nextauth]/       │  ← handles /api/auth/* endpoints
         │  route.ts             │
         │                       │
         │  lib/auth.ts          │  ← Auth.js config (providers, callbacks)
         │  auth.ts              │  ← NextAuth instance + exports
         └───────────┬───────────┘
                     │ fetch() calls
         ┌───────────▼───────────┐
         │  EXPRESS BACKEND      │
         │  backend/server.js    │  ← Express app, Supabase client
         │  routes/auth.route.js │  ← POST /api/auth/login, /register
         │  controllers/         │  ← business logic, bcrypt, JWT
         │  auth.controller.js   │
         └───────────┬───────────┘
                     │ SQL queries
         ┌───────────▼───────────┐
         │  SUPABASE (Postgres)  │
         │  users table          │
         │  patient_profiles     │
         │  doctor_profiles      │
         └───────────────────────┘
```

**Two separate JWT systems run in parallel:**

| System | Who creates it | Where stored | What it's for |
|--------|---------------|--------------|---------------|
| Auth.js session JWT | Next.js (Auth.js) | HttpOnly cookie | Proving identity to Next.js pages/middleware |
| Backend access token | Express (jsonwebtoken) | In Auth.js session + memory | Calling Express API routes |

---

## 2. File-by-File Breakdown

### `lib/auth.ts` — Auth.js Configuration

**Purpose:** The brain of the entire auth system. Defines HOW authentication works.

```typescript
// lib/auth.ts

const AUTH_SECRETS = [
    process.env.AUTH_SECRET,
    process.env.NEXTAUTH_SECRET,
    process.env.JWT_SECRET,
    "dev-auth-secret-change-me",
].filter(Boolean) as string[]
```
**`AUTH_SECRETS` array** — Tries multiple secrets in order. Supports secret rotation so old sessions aren't immediately invalidated when you change your secret.

---

```typescript
cookies: {
    sessionToken: {
        name: "authjs.session-token.v2",  // custom cookie name
        options: {
            httpOnly: true,     // JS cannot read it (XSS protection)
            sameSite: "lax",    // CSRF protection
            path: "/",          // valid on all routes
            secure: process.env.NODE_ENV === "production",  // HTTPS only in prod
        },
    },
},
```
**Cookie config** — Forces HttpOnly so JavaScript cannot steal the session token. `sameSite: "lax"` prevents CSRF attacks. The `.v2` suffix in the name ensures old stale cookies (from before config changes) are ignored.

---

```typescript
pages: {
    signIn: "/auth/login",   // redirect here when login is needed
    error: "/auth/error"     // redirect here on auth errors
},
```
**Custom pages** — Overrides Auth.js's built-in login UI with your own pages.

---

```typescript
session: {
    strategy: "jwt",          // store session in JWT cookie, NOT database
    maxAge: 30 * 24 * 60 * 60 // 30-day expiry
},
```
**Session strategy** — `"jwt"` means no database lookups needed to verify a session. The session is self-contained in the encrypted cookie.

---

```typescript
CredentialsProvider({
    async authorize(credentials) {
        // 1. Validate input
        // 2. POST to your Express backend
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password })
        })
        // 3. If backend returns { user, token } → return user object to Auth.js
        return {
            id: data.user.id,
            name: data.user.first_name + " " + data.user.last_name,
            email: data.user.email,
            role: data.user.role,          // ← custom field
            accessToken: data.token        // ← backend JWT, stored in session
        }
    }
})
```
**`CredentialsProvider.authorize()`** — This is the bridge between Auth.js and your Express backend. Auth.js calls this when a user submits the login form. It proxies credentials to Express, gets back the user + backend token, and returns them to Auth.js.

---

```typescript
callbacks: {
    async jwt({ token, user }) {
        if (user) {
            // Only runs on initial login
            token.id = user.id
            token.role = user.role           // ← save role into JWT
            token.accessToken = user.accessToken  // ← save backend token into JWT
        }
        return token  // this becomes the encrypted cookie
    },

    async session({ session, token }) {
        // Runs on every request that checks the session
        session.user.id = token.id
        session.user.role = token.role           // ← expose role to client
        session.user.accessToken = token.accessToken  // ← expose backend token
        return session
    },
}
```
**`jwt` callback** — Runs when the JWT is created or refreshed. Embeds `role` and `accessToken` into the cookie payload.

**`session` callback** — Runs when `useSession()` or `auth()` is called. Copies fields from JWT into the session object that components can read.

---

### `auth.ts` — NextAuth Instance

**Purpose:** Creates the single Auth.js instance. Everything imports from here.

```typescript
import NextAuth from "next-auth";
import { authOptions } from "./lib/auth";

export const { auth, signIn, signOut, handlers } = NextAuth(authOptions);
//              ↑         ↑        ↑        ↑
//              │         │        │        └── GET/POST handlers for /api/auth/*
//              │         │        └── call this to log out
//              │         └── call this to log in (server-side or form action)
//              └── check session (server components, middleware)
```

| Export | Used in | Does |
|--------|---------|------|
| `auth` | `proxy.ts`, server components | Reads & verifies the session cookie |
| `signIn` | Login page | Triggers authentication |
| `signOut` | Nav bar | Clears the session cookie |
| `handlers` | `app/api/auth/[...nextauth]/route.ts` | Handles all `/api/auth/*` HTTP requests |

---

### `app/api/auth/[...nextauth]/route.ts` — API Route Handler

**Purpose:** Registers Auth.js as an HTTP endpoint so the browser can communicate with it.

```typescript
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

This single file makes Auth.js respond to:

| URL | Method | What it does |
|-----|--------|--------------|
| `/api/auth/session` | GET | Returns current session JSON to browser |
| `/api/auth/signin` | GET/POST | Handles sign-in flow |
| `/api/auth/signout` | POST | Clears session cookie |
| `/api/auth/csrf` | GET | Returns CSRF token |
| `/api/auth/providers` | GET | Lists configured providers |

---

### `proxy.ts` — Route Protection Middleware

**Purpose:** Intercepts EVERY request before the page renders. First line of defense.

```typescript
import { auth } from "@/auth";

const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/register", "/auth/error"];

export default auth((req) => {
    const session = req.auth;       // reads + verifies the cookie
    const pathname = req.nextUrl.pathname;
    const isPublic = PUBLIC_ROUTES.includes(pathname);

    // Rule 1: Logged-in users visiting public pages → go to their dashboard
    if (session && (pathname === "/" || pathname.startsWith("/auth"))) {
        const role = session.user?.role;
        if (role === "patient") return redirect("/patient/dashboard");
        if (role === "doctor")  return redirect("/doctor/dashboard");
        if (role === "admin")   return redirect("/admin/dashboard");
    }

    // Rule 2: Guests visiting private pages → go to login
    if (!session && !isPublic) {
        return redirect("/auth/login");
    }

    // Rule 3: Wrong role on a route → go to login
    if (pathname.startsWith("/patient") && role !== "patient") return redirect("/auth/login");
    if (pathname.startsWith("/doctor")  && role !== "doctor")  return redirect("/auth/login");
    if (pathname.startsWith("/admin")   && role !== "admin")   return redirect("/auth/login");
});

export const config = {
    // Runs on everything except static files
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)"],
};
```

**Key insight:** This runs in the Edge Runtime (not Node.js). It runs before ANY page code executes, making it impossible for a user to even see protected page code without a valid session.

---

### `app/layout.tsx` — Root Layout

**Purpose:** Wraps the entire app in `SessionProvider` so any client component can call `useSession()`.

```typescript
export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <SessionProvider>  {/* ← makes useSession() work everywhere */}
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
```

`SessionProvider` automatically calls `/api/auth/session` when the browser loads to get the current session. It caches the result and shares it through React Context.

---

### `lib/axios.ts` — Authenticated HTTP Client

**Purpose:** Makes all API calls automatically include the backend JWT token.

```typescript
// Request interceptor: adds Auth header before every request
axiosInstance.interceptors.request.use(async (config) => {
    const session = await getSession()
    if (session?.user) {
        const token = session.accessToken
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Response interceptor: handles expired/invalid tokens
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/auth/login"  // ← force logout on 401
        }
        return Promise.reject(error)
    }
)
```

---

### `backend/server.js` — Express Entry Point

**Purpose:** Starts the Express server, connects to Supabase, mounts routes.

```javascript
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY  // admin key — bypasses row-level security
)

app.use("/api/auth", authRoutes(supabase))  // mounts at POST /api/auth/login, /register
```

**Why Supabase is passed into routes:** The Supabase client is created once at startup and injected into route handlers. This avoids creating a new connection per request.

---

### `backend/routes/auth.route.js` — Route Definitions

```javascript
const authRoutes = (supabase) => {
    const router = express.Router()
    router.post("/register", (req, res) => registerController(req, res, supabase))
    router.post("/login",    (req, res) => loginController(req, res, supabase))
    return router
}
```

| Method | Path | Controller |
|--------|------|-----------|
| POST | `/api/auth/register` | `registerController` |
| POST | `/api/auth/login` | `loginController` |

---

### `backend/controllers/auth.controller.js` — Business Logic

#### `registerController`
```
1. Validate required fields (email, password, first_name, last_name)
2. Check if user already exists in Supabase
3. Hash password with bcrypt (salt rounds: 10)
4. Insert user into `users` table
5. Create role-specific profile:
   - patient → insert into `patient_profiles`
   - doctor  → insert into `doctor_profiles` (generates LIC-{timestamp})
6. Return user (without password_hash)
```

#### `loginController`
```
1. Validate email and password are present
2. Fetch user from `users` table by email
3. Compare submitted password against bcrypt hash
4. If match: sign a JWT with { id, email, role } using JWT_SECRET
5. Update `last_login` timestamp in database
6. Return { user (no password), token }
```

---

### `lib/validations.ts` — Form Validation Schemas

**Purpose:** Zod schemas that validate form data on the frontend before any API call is made.

```typescript
registerSchema validates:
  - name: min 2 chars
  - email: valid email format
  - password: min 8 chars + uppercase + number + special char
  - confirmPassword: must match password
  - role: "patient" | "doctor"
  - terms: must be true
  - If role === "doctor": specialization, experience, fee are required
```

---

## 3. Registration Flow

```
User fills /auth/register form
        │
        ▼
registerSchema.parse(formData)     ← lib/validations.ts
        │
        ├── FAIL → show inline validation errors (no API call made)
        │
        └── PASS
                │
                ▼
        axiosInstance.post("/auth/register", data)    ← lib/axios.ts
                │
                ▼
        POST http://localhost:3001/api/auth/register  ← backend
                │
                ▼
        registerController(req, res, supabase)        ← auth.controller.js
                │
                ├── email exists?  → 400 "User already exists"
                │
                └── new user:
                        │
                        ├── bcrypt.hash(password, 10)
                        │
                        ├── INSERT into users table
                        │
                        ├── role === "patient" → INSERT into patient_profiles
                        │   role === "doctor"  → INSERT into doctor_profiles
                        │
                        └── 201 { user, message: "Registration Successful" }
                                │
                                ▼
                        toast.success("Account created!")
                        router.push("/auth/login")
```

**Note:** Registration does NOT log the user in automatically. They are redirected to login after registration.

---

## 4. Login Flow

```
User fills /auth/login form
        │
        ▼
signIn("credentials", { email, password })    ← next-auth/react
        │
        ▼
Auth.js calls authorize() in lib/auth.ts
        │
        ▼
POST http://localhost:3001/api/auth/login     ← fetch() inside authorize()
        │
        ├── 400 Bad Request   → throw Error("Email and password are required")
        ├── 401 Unauthorized  → throw Error("Invalid email or password")
        └── 500 Server Error  → throw Error("Authentication failed")
        │
        └── 200 OK  { user, token }
                │
                ▼
        authorize() returns:
        {
            id: user.id,
            name: "John Doe",
            email: "john@example.com",
            role: "patient",          ← from backend
            accessToken: "eyJ..."     ← backend JWT
        }
                │
                ▼
        Auth.js jwt() callback runs:
        token.id          = user.id
        token.role        = "patient"
        token.accessToken = "eyJ..."
                │
                ▼
        Auth.js encrypts token → stores as HttpOnly cookie
        "authjs.session-token.v2" = [encrypted JWT]
                │
                ▼
        Auth.js session() callback runs:
        session.user.id          = token.id
        session.user.role        = "patient"
        session.user.accessToken = "eyJ..."
                │
                ▼
        Browser cookie is set
        proxy.ts detects session on next request
        Redirect → /patient/dashboard
```

---

## 5. Session & JWT Lifecycle

```
After successful login:

Browser cookie: "authjs.session-token.v2"
├── Encrypted with AUTH_SECRET
├── Contains: { id, email, name, role, accessToken, exp, iat }
├── HttpOnly: true  (JS cannot read it)
├── Expires: 30 days
└── secure: true in production

Every subsequent page request:
        │
        ▼
proxy.ts calls auth(req)
        │
        └── Auth.js decrypts cookie
                ├── FAIL (bad secret / expired) → session = null → redirect /auth/login
                └── SUCCESS → session = { user: { id, email, role, accessToken } }

Client components call useSession():
        │
        └── SessionProvider fetches GET /api/auth/session
                └── Returns session JSON from the cookie
```

---

## 6. Route Protection (Middleware)

Every request goes through `proxy.ts` **before** any page or API route code runs.

### Decision Tree

```
Request arrives at any URL
        │
        ▼
Is it a static file? (_next/static, .png, .svg, favicon)
        ├── YES → pass through (middleware skipped)
        └── NO  → run middleware
                        │
                        ▼
                Read & decrypt session cookie
                        │
                ┌───────┴──────────┐
             session?            no session?
                │                    │
                ▼                    ▼
         Is path "/" or        Is path public?
         "/auth/*"?            (/, /auth/*, ...)
                │                    │
         YES    │ NO            YES  │  NO
          │     │                │   │
          ▼     ▼                ▼   ▼
      Redirect  Role         Allow  Redirect to
      to        check         pass  /auth/login
      dashboard │
                │
         ┌──────┼──────┐
         ▼      ▼      ▼
      /patient /doctor /admin
         │      │      │
      role    role    role
      check   check   check
         │      │      │
      FAIL→  FAIL→  FAIL→
      /auth   /auth   /auth
      /login  /login  /login
```

### Examples

| URL | Session | Role | Result |
|-----|---------|------|--------|
| `/` | None | — | ✅ Allowed (public) |
| `/` | Yes | patient | ↩️ Redirect → `/patient/dashboard` |
| `/auth/login` | Yes | doctor | ↩️ Redirect → `/doctor/dashboard` |
| `/auth/login` | None | — | ✅ Allowed (public) |
| `/patient/dashboard` | None | — | ↩️ Redirect → `/auth/login` |
| `/patient/dashboard` | Yes | patient | ✅ Allowed |
| `/patient/dashboard` | Yes | doctor | ↩️ Redirect → `/auth/login` |
| `/doctor/schedule` | Yes | doctor | ✅ Allowed |
| `/admin/users` | Yes | patient | ↩️ Redirect → `/auth/login` |

---

## 7. API Calls After Login (Axios)

After login, when a component fetches data from the Express backend:

```
Component calls:
axiosInstance.get("/appointments")
        │
        ▼
Request interceptor runs (lib/axios.ts)
        │
        ▼
getSession()  → reads Auth.js session
        │
        └── session.user.accessToken = "eyJ..."  (backend JWT)
                │
                ▼
        Adds header:
        Authorization: Bearer eyJ...
                │
                ▼
GET http://localhost:3001/api/appointments
        │
        ├── Backend verifies JWT with JWT_SECRET
        │
        ├── 401 Unauthorized → axios response interceptor
        │                   → window.location.href = "/auth/login"
        │
        └── 200 OK → returns data to component
```

**Important:** The backend JWT (`accessToken`) is different from the Auth.js cookie JWT. The backend issues its own JWT during login. Auth.js stores it inside its encrypted cookie. Axios reads it back out and sends it to the backend on every API call.

---

## 8. Complete End-to-End Flow Chart

```
                          REGISTRATION
                          ───────────
Form Submit
    │
    ▼
Zod Validation (client) ──FAIL──→ Show errors
    │ PASS
    ▼
POST /api/auth/register (axiosInstance)
    │
    ▼
Express: registerController
    │
    ├── Hash password (bcrypt)
    ├── Insert user
    ├── Insert role profile
    └── 201 → toast success → redirect /auth/login


                            LOGIN
                            ─────
Form Submit
    │
    ▼
signIn("credentials", { email, password })
    │
    ▼
Auth.js: authorize() in lib/auth.ts
    │
    ▼
POST /api/auth/login (fetch inside authorize)
    │
    ▼
Express: loginController
    │
    ├── Verify password (bcrypt.compare)
    ├── Sign JWT (jsonwebtoken)
    └── Return { user, token }
    │
    ▼
Auth.js: jwt() callback
    → embeds role + accessToken into JWT
    │
    ▼
Auth.js: session() callback
    → exposes role + accessToken to client
    │
    ▼
Encrypted cookie set in browser
    │
    ▼
proxy.ts on next request:
    session.user.role === "patient"
    → Redirect /patient/dashboard


                       PROTECTED PAGE ACCESS
                       ─────────────────────
Browser requests /patient/appointments
    │
    ▼
proxy.ts intercepts (BEFORE page loads)
    │
    ▼
auth(req) → decrypt cookie
    │
    ├── No cookie → redirect /auth/login
    ├── Wrong role → redirect /auth/login
    └── Correct role → allow request
                │
                ▼
        Page component renders
                │
                ▼
        Component calls axiosInstance.get("/appointments")
                │
                ▼
        Interceptor adds: Authorization: Bearer <accessToken>
                │
                ▼
        Express validates JWT
                │
                ├── Invalid → 401 → redirect /auth/login
                └── Valid → return data → render UI
```

---

## 9. Route Access Matrix

| Route | Public | Patient | Doctor | Admin |
|-------|--------|---------|--------|-------|
| `/` | ✅ | ↩️ → dashboard | ↩️ → dashboard | ↩️ → dashboard |
| `/auth/login` | ✅ | ↩️ → dashboard | ↩️ → dashboard | ↩️ → dashboard |
| `/auth/register` | ✅ | ↩️ → dashboard | ↩️ → dashboard | ↩️ → dashboard |
| `/auth/error` | ✅ | ✅ | ✅ | ✅ |
| `/patient/*` | ❌ login | ✅ | ❌ login | ❌ login |
| `/doctor/*` | ❌ login | ❌ login | ✅ | ❌ login |
| `/admin/*` | ❌ login | ❌ login | ❌ login | ✅ |
| `/api/auth/*` | ✅ (Auth.js handles) | ✅ | ✅ | ✅ |

---

## 10. Environment Variables

| Variable | Used by | Purpose |
|----------|---------|---------|
| `AUTH_SECRET` | Auth.js | Encrypts session JWT cookies |
| `NEXTAUTH_SECRET` | Auth.js (fallback) | Legacy name for auth secret |
| `JWT_SECRET` | Express + Auth.js fallback | Signs backend access tokens |
| `NEXT_BACKEND_URL` | `lib/auth.ts` (server-side) | Backend URL for `authorize()` fetch |
| `NEXT_PUBLIC_API_URL` | `lib/axios.ts` (client-side) | Backend URL for client API calls |
| `SUPABASE_URL` | `backend/server.js` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `backend/server.js` | Admin Supabase key |

> ⚠️ **Current issue in your .env**: `NEXT_BACKEND_URL` is `http://localhost:5000/api` but your server runs on port `3001` (set by `PORT=3001`). These must match.

```env
# Fix: make these consistent
PORT=3001
NEXT_BACKEND_URL=http://localhost:3001/api
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 11. Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `MissingSecret` | `AUTH_SECRET` not found in env | Add `AUTH_SECRET=...` to `.env` |
| `JWTSessionError: no matching decryption secret` | Old cookie encrypted with different secret | Clear browser cookies or use secret rotation array |
| `/api/auth/session` returns 404 | Missing `app/api/auth/[...nextauth]/route.ts` | Create the route file that exports `{ GET, POST } = handlers` |
| `ClientFetchError: Unexpected token '<'` | `/api/auth/session` returns HTML instead of JSON | Caused by the 404 above — fix the route file |
| `401` from Express | Backend JWT expired or wrong `JWT_SECRET` | Check secret matches between login and verification |
| Login redirects loop | Middleware and public routes misconfigured | Ensure `/auth/login` is in `PUBLIC_ROUTES` array |
| `authorize()` fails silently | Backend URL is wrong | Check `NEXT_BACKEND_URL` matches `PORT` in `.env` |
