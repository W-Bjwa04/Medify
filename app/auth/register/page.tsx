"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type RegisterFormData, registerSchema } from "@/lib/validations"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Stethoscope } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

const specializations = [
    "Cardiologist", "Neurologist", "Orthopedist", "Pediatrician",
    "Dermatologist", "Ophthalmologist", "Psychiatrist", "General Physician",
    "Gynecologist", "ENT Specialist",
]

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
    let score = 0
    if (password.length >= 8) score += 25
    if (/[A-Z]/.test(password)) score += 25
    if (/[0-9]/.test(password)) score += 25
    if (/[^A-Za-z0-9]/.test(password)) score += 25

    const labels = [
        { min: 0, label: "Very Weak", color: "bg-red-500" },
        { min: 25, label: "Weak", color: "bg-orange-500" },
        { min: 50, label: "Fair", color: "bg-yellow-500" },
        { min: 75, label: "Strong", color: "bg-blue-500" },
        { min: 100, label: "Very Strong", color: "bg-green-500" },
    ]
    const { label, color } = [...labels].reverse().find((l) => score >= l.min) ?? labels[0]
    return { score, label, color }
}

const RegisterPage = () => {
    // FIX 1: Added missing showPassword state
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [passwordValue, setPasswordValue] = useState("")
    const router = useRouter()

    const strength = getPasswordStrength(passwordValue)

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: "patient",
            terms: false, 
        },
    })

    
    const role = form.watch("role")

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)
        try {
            await axiosInstance.post("/auth/register", data)
            toast.success("Account created! Please log in.")
            router.push("/auth/login")
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="w-full border-b border-border px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Stethoscope className="h-5 w-5" />
                    ClinicApp
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <Card className="shadow-lg">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-2xl font-bold">Create account</CardTitle>
                            <CardDescription>Join ClinicApp as a patient or doctor</CardDescription>
                        </CardHeader>

                        <CardContent className="pt-4">
                            <Tabs
                                value={role}
                                onValueChange={(v) => form.setValue("role", v as "patient" | "doctor")}
                                className="mb-6"
                            >
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="patient">Patient</TabsTrigger>
                                    <TabsTrigger value="doctor">Doctor</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                                    <FormField
                                        control={form.control}
                                        name="first_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="last_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="you@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(e)
                                                                setPasswordValue(e.target.value)
                                                            }}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                            onClick={() => setShowPassword((prev) => !prev)}
                                                            tabIndex={-1}
                                                        >
                                                            {showPassword
                                                                ? <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                                : <Eye className="h-4 w-4 text-muted-foreground" />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                {passwordValue && (
                                                    <div className="mt-2 space-y-1">
                                                        <Progress value={strength.score} className="h-1.5" />
                                                        <p className="text-xs text-muted-foreground">
                                                            Strength: <span className="font-medium">{strength.label}</span>
                                                        </p>
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••••" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {role === "doctor" && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name="specialization"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Specialization</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select specialization" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {specializations.map((s) => (
                                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-2 gap-3">
                                                {/* FIX 5: valueAsNumber converts string → number for zod schema */}
                                                <FormField
                                                    control={form.control}
                                                    name="experience"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Experience (years)</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="5"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="fee"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Consultation Fee ($)</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="100"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="terms"
                                        render={({ field }) => (
                                            <FormItem className="flex items-start gap-2 space-y-0">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal leading-relaxed cursor-pointer">
                                                    I agree to the{" "}
                                                    <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
                                                    {" "}and{" "}
                                                    <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                                                </FormLabel>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        Create Account
                                    </Button>
                                </form>
                            </Form>

                            <p className="text-center text-sm text-muted-foreground mt-6">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="text-primary font-medium hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

export default RegisterPage