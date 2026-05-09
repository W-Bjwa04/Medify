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




    } catch (error) {

    }
}