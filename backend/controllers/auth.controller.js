import bcrypt from "bcryptjs"

// register controller 


export const registerController = async (req, res, supabase) => {
    try {
        const { email, password, first_name, last_name, role = "patient" } = req.body

        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        // Check if users already exits 
        const { data: existingUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single()

        if (existingUser) {
            return res.status(400).json({
                message: "User already exits"
            })
        }

        // Hash Password 
        const hashedPassword = await bcrypt.hash(password, 10)

        // crrate user 

        const { data: newUser, error } = await supabase
            .from("users")
            .insert([
                {

                    email,
                    password_hash: hashedPassword,
                    first_name,
                    last_name,
                    role,

                }
            ])
            .select()
            .single(
        )

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        // Create role-specific profile 
        if (role === "patient") {
            await supabase.from("patient_profiles").insert([
                {
                    user_id: newUser.id
                }
            ])
        } else if (role === "doctor") {
            await supabase.from("doctor_profiles").insert([
                {

                    user_id: newUser.id,
                    license_number: `LIC-${Date.now()}`,
                    specialization_id: '00000000-0000-0000-0000-000000000000', // Default specialization

                }
            ])
        }

        const { password_hash, ...newUserWithoutPassword } = newUser
        res.status(201).json({
            user: newUserWithoutPassword,
            message: "Registration Successfull"
        })

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
}