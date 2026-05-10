"use client"

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginFormData, loginSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Stethoscope } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from "next-auth/react"
import { toast } from 'sonner'
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const LoginPage = () => {


    const [authError, setAuthError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" }
    })

    // handler for login form submission 

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        setAuthError(null)
        try {
            // API: POST /api/auth/login → { email, password } → returns { user, token }
            // BACKEND: controllers/authController.js → login()
            // AUTH: public endpoint
            const result = await signIn("credentials", {
                email: data.email, password: data.password, redirect: false
            })

            if (result?.error) {
                setAuthError("Invalid email or password. Please try again ..")
                return
            }

            toast.success("Welcome back!")
            router.push("/")
            router.refresh()

        } catch (error) {
            setAuthError("An unexpected error occurred.");
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className='min-h-screen bg-background flex flex-col'>
            <header className='w-full border-b border-border px-6 py-4 flex items-center justify-between'>
                <Link href="/" className='flex items-center gap-2 font-bold text-xl text-primary'>
                    <Stethoscope className="h-5 w-5" />ClinicApp
                </Link>
            </header>

            <main className='flex-1 flex items-center justify-center px-4 py-12'>
                <div className='w-full max-w-7xl'>
                    <div className='grid grid-cols-12 gap-6'>
                        <div className='col-span-12 md:col-span-8 md:col-start-3 lg:col-span-4 
                        lg:col-start-5
                        '>
                            <Card className='shadow-lg'>
                                <CardHeader className='text-center pb-2'>
                                    <CardTitle className='text-2xl font-bold'>
                                        Welcome Back
                                    </CardTitle>
                                    <CardDescription>
                                        Sign in to your ClinicApp account
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className='pt-4'>
                                    {
                                        authError && (
                                            <Alert variant="destructive" className='mb-4'>
                                                <AlertDescription>
                                                    {authError}
                                                </AlertDescription>
                                            </Alert>
                                        )
                                    }

                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)}
                                            className='space-y-4'
                                        >
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={
                                                    ({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Email
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type='email'
                                                                    placeholder='you@example.com'
                                                                    autoComplete='email'
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )
                                                }

                                            />

                                            <FormField control={form.control} name="password" render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel>Password</FormLabel>
                                                        <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
                                                    </div>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" {...field} />
                                                            <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                                                                {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            <Button type='submit' className='w-full gap-2'
                                                disabled={isLoading}
                                            >
                                                {
                                                    isLoading && <Loader2 className='h-4 w-4 animate-spin' />
                                                } Sign In
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default LoginPage