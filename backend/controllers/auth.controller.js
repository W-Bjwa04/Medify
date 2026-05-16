import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// register controller 


export const registerController = async (req, res, supabase) => {
    try {

        const { email, password, first_name, last_name, role = "patient" } = req.body

        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }


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
            const { data: patientProfile, error: patientProfileError } = await supabase.from("patient_profiles").insert([
                {
                    user_id: newUser.id
                }
            ]).select().single()

            if (patientProfileError) {
                return res.status(400).json({ message: patientProfileError.message });
            }
        } else if (role === "doctor") {
            const { data: doctorProfile, error: doctorProfileError } = await supabase.from("doctor_profiles").insert([
                {
                    user_id: newUser.id,
                    license_number: `LIC-${Date.now()}`,
                    // specialization_id: '00000000-0000-0000-0000-000000000000', // Default specialization

                }
            ]).select().single()

            if (doctorProfileError) {
                return res.status(400).json({ message: doctorProfileError.message });
            }
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


// login controller 

export const loginController = async (req, res, supabase) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        console.log(email, password)


        // get the user from database 

        const { data: users, error: userError } =
            await supabase
                .from("users")
                .select("*")
                .eq("email", email)
                .single()

        if (userError || !users) {
            return res.status(401).json({
                message: "Invalid credentials", 
                error:userError
            })
        }

   
        // compare the password 

        const isPasswordCorrect = await bcrypt.compare(password, users.password_hash)

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid password credentials"
            })
        }

        // create access token
        const accessToken = jwt.sign(
            {
                id: users.id,
                email: users.email,
                role: users.role,
            },
            process.env.JWT_SECRET,
        );


        // update last login 

        const { error } = await supabase
            .from("users")
            .update({
                last_login: new Date().toISOString()
            })
            .eq("id", users.id)


        if (error) {
            return res.status(400).json({ message: 'Error while updating the last login' });
        }

        // Return User without password 
        const { password_hash, ...userWithoutPassword } = users


        res.json({
            user: userWithoutPassword,
            token: accessToken,
            message: "Login Successfull"
        })
    } catch (error) {
        console.error("Login error: ", error)
        res.status(500).json({
            message: "Login failed"
        })
    }
}

// change password 

export const changePasswordController = async (req, res, supabase) => {
    try {

        const loggedInUser = req.user
        console.log(loggedInUser)
        const { old_password, new_password } = req.body

        if (!old_password || !new_password) {
            return res.status(400).json({
                message: "Both old and new passwords are required"
            })
        }

        // get password hash
        const { data: user, error } = await supabase
            .from("users")
            .select("password_hash")
            .eq("id", loggedInUser.id)
            .single()

        if (error || !user) {
            return res.status(400).json({
                message: "User not found"
            })
        }

        
        const isPasswordValid = await bcrypt.compare(
            old_password,
            user.password_hash
        )

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Incorrect password"
            })
        }

        const newHashedPassword = await bcrypt.hash(new_password, 10)

        
        const { error: changePasswordError } = await supabase
            .from("users")
            .update({ password_hash: newHashedPassword })
            .eq("id", loggedInUser.id)

        if (changePasswordError) {
            return res.status(400).json({
                message: "Error while changing password"
            })
        }

        return res.status(200).json({
            message: "Password changed successfully"
        })

    } catch (error) {
        console.error("Change Password error:", error)

        return res.status(500).json({
            message: "Change password failed"
        })
    }
}