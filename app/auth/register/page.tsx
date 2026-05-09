"use client"
import { Form, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterFormData, registerSchema } from "@/lib/validations"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TabsContent } from "@/components/ui/tabs"
import { useState } from "react"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"



const RegisterPage = () => {


    const [role, setRole] = useState<"patient" | "doctor">("patient")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // validate the form using the zod schema

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "patient",
            terms: true,
        }
    })

    // function for handle form submission 

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)
        try {
            // API: POST /api/auth/register → { name, email, password, role, ...roleFields } → returns { user, token }
            // BACKEND: controllers/authController.js → register()
            // AUTH: public endpoint

            await axiosInstance.post("/auth/register", { ...data, role })
            toast.success("Account created! Please verify your email.")

        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="w-full border-b border-border px-6 flex items-center justify-between">
                <Link href="/" className="font-bold text-xl text-primary">
                    Home
                </Link>
            </header>
            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-7xl">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-8 md:col-start-3 
                        lg:col-span-4 lg:col-start-5
                        ">
                            <Card className="shadow-lg ">
                                <CardHeader className="text-center pb-2">
                                    <CardTitle className="text-2xl font-bold">
                                        Create Account
                                    </CardTitle>
                                    <CardDescription>
                                        Join Clinic App as a patient or doctor
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <Tabs value={role} onValueChange={(v) => {
                                        setRole(v as "patient" | "doctor")
                                        form.setValue("role", v as "patient" | "doctor")
                                    }} className="mb-6">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="patient">
                                                Patient
                                            </TabsTrigger>
                                            <TabsTrigger value="doctor">
                                                Doctor
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)}
                                            className="space-y-4"
                                        >

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

export default RegisterPage

