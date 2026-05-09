import { z } from "zod"

// -- Auth Schemas ------------------

export const registerSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
        confirmPassword: z.string(),
        role: z.enum(["patient", "doctor"]),
        terms: z.boolean().refine(val => val === true, {
            message: "You must agree to the terms",
        }),

        // Doctor-specific fields (optional, required when role === "doctor")
        specialization: z.string().min(2, "Specialization must be at least 2 characters").optional(),
        experience: z.coerce.number().min(0, "Experience must be a positive number").optional(),
        fee: z.coerce.number().min(0, "Fee must be a positive number").optional(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine(
        (data) => {
            if (data.role === "doctor") {
                return !!data.specialization && !!data.experience && !!data.fee
            }
            return true;
        },
        {
            message: "Doctor-specific fields are required",
            path: ["specialization", "experience", "fee"],
        }
    )


// Type Exports 

export type RegisterFormData = z.infer<typeof registerSchema>