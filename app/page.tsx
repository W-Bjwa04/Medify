"use client"

import { ArrowRight, Menu, Stethoscope } from "lucide-react"
import Link from "next/link"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@radix-ui/react-navigation-menu"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"


const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Doctors", href: "#doctors" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" }
]

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar*/}
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-6 items-center h-16">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                <Stethoscope className="h-6 w-6" />
                ClinicApp
              </Link>
            </div>

            {/* large screen */}
            <div className="col-span-7 hidden lg:flex">
              <NavigationMenu>
                <NavigationMenuList className="flex flex-row gap-1 items-center">
                  {
                    navLinks.map((item) => (
                      <NavigationMenuItem key={item.label}>
                        <NavigationMenuLink asChild>
                          <Link href={item.href}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                          >
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))
                  }

                </NavigationMenuList>
              </NavigationMenu>
            </div>
            <div
              className="col-span-3 hidden lg:flex items-center justify-end gap-3"
            >
              <ThemeToggle />
              <Link href="/auth/login"><Button
                variant="ghost"
                size="sm"
              >
                Login
              </Button></Link>
              <Link href="/auth/register"><Button
                size="sm"
                className="gap-1"
              >
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button></Link>
            </div>
            {/* mobile screen */}
            <div
              className="col-span-10 lg:hidden flex justify-end items-center gap-2"
            >
              <ThemeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <nav className="flex flex-col gap-4 mt-8">
                    {
                      navLinks.map((item) => (
                        <Link key={item.label} href={item.href} className="text-lg font-medium hover:text-primary transition-colors"> {item.label}
                        </Link>
                      ))
                    }
                    <Separator />
                    <Link href="/auth/login">
                      <Button className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>

            </div>

          </div>
        </div>

      </header>
    </div>
  )
}

export default LandingPage