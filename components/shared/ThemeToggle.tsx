"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"


export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle Theme"
                className="hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                disabled
            >
                <Sun className="h-5 w-5" />
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle Theme"
            className="hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
            {theme === "dark" ? (
                <Sun
                    className="h-5 w-5 text-yellow-400 transition-all duration-300 hover:rotate-180"
                />
            ) : (
                <Moon
                    className="h-5 w-5 text-blue-400 transition-all duration-300 hover:scale-110"
                />
            )}
        </Button>
    )
}