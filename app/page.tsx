"use client"

import { ArrowRight, Bone, BrainCog, Calendar, Check, ChevronRight, Eye, HeartPulse, Icon, Mail, MapPin, Menu, Phone, Pill, Shield, Star, Stethoscope, Users } from "lucide-react"
import Link from "next/link"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@radix-ui/react-navigation-menu"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Activity, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { Switch } from "@/components/ui/switch"
import { Accordion } from "@/components/ui/accordion"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"



const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Doctors", href: "#doctors" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" }
]


const features = [
  {
    icon: Calendar,
    title: "Easy Appointment Booking",
    description: "Book appointments with top specialists in just a few clicks. Choose your preferred time slot and doctor.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your medical data is encrypted and protected. We comply with all healthcare data regulations.",
  },
  {
    icon: Activity,
    title: "Real-time Health Tracking",
    description: "Monitor your medical records, prescriptions, and upcoming appointments all in one dashboard.",
  },
];


const steps = [
  { num: "01", title: "Create Account", description: "Sign up as a patient or doctor in under 2 minutes." },
  { num: "02", title: "Find a Doctor", description: "Browse specialists by specialization, rating, and availability." },
  { num: "03", title: "Book Appointment", description: "Select a time slot and confirm your booking instantly." },
  { num: "04", title: "Get Consultation", description: "Meet your doctor in-person or via secure video call." },
];


const doctors = [
  { name: "Dr. Sarah Johnson", specialization: "Cardiologist", rating: 4.9, reviews: 234, fee: 150, icon: HeartPulse },
  { name: "Dr. Michael Chen", specialization: "Neurologist", rating: 4.8, reviews: 189, fee: 180, icon: BrainCog },
  { name: "Dr. Emily Williams", specialization: "Ophthalmologist", rating: 4.9, reviews: 312, fee: 120, icon: Eye },
  { name: "Dr. James Brown", specialization: "Orthopedist", rating: 4.7, reviews: 156, fee: 200, icon: Bone },
];

const testimonials = [
  { name: "Alice Thompson", role: "Patient", quote: "ClinicApp made booking my cardiology appointment incredibly easy. The interface is clean and the doctors are top-notch.", rating: 5 },
  { name: "Bob Martinez", role: "Patient", quote: "I love the prescription management feature. I can always access my medical history from anywhere.", rating: 5 },
  { name: "Dr. Rachel Green", role: "Doctor", quote: "Managing my schedule and patient records has never been easier. ClinicApp transformed my practice.", rating: 5 },
];



const pricingPlans = [
  {
    name: "Free", monthlyPrice: 0, yearlyPrice: 0, description: "Perfect for individual patients",
    features: ["Up to 5 appointments/month", "Basic medical records", "Email notifications", "Standard support"],
    highlighted: false,
  },
  {
    name: "Pro", monthlyPrice: 29, yearlyPrice: 249, description: "Ideal for active patients and solo doctors",
    features: ["Unlimited appointments", "Full medical records", "SMS + Email notifications", "Priority support", "Video consultations", "Prescription management"],
    highlighted: true,
  },
  {
    name: "Clinic", monthlyPrice: 99, yearlyPrice: 899, description: "For clinics and medical practices",
    features: ["Everything in Pro", "Multiple doctor accounts", "Admin dashboard", "Analytics & reports", "Custom branding", "Dedicated account manager"],
    highlighted: false,
  },
];

const faqs = [
  { q: "How do I book an appointment?", a: "Simply create an account, search for a doctor by specialization or name, select an available time slot, and confirm your booking." },
  { q: "Is my medical data secure?", a: "Yes. All data is encrypted in transit and at rest. We follow HIPAA compliance guidelines and never share your personal health information." },
  { q: "Can I cancel or reschedule an appointment?", a: "Yes, you can cancel or reschedule appointments up to 2 hours before the scheduled time from your patient dashboard." },
  { q: "How do video consultations work?", a: "After booking an online appointment, you ll receive a secure video call link. The consultation happens directly through our platform." },
  { q: "How do doctors join the platform?", a: "Doctors register, complete their profile with credentials and specialization, and go through a verification process." },
];


function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {
        Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={
            `h-3.5 w-3.5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`
          } />
        ))
      }
    </div>
  )
}


const LandingPage = () => {


  const [yearlytBilling, setYearlyBilling] = useState(false)
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
                  <Button variant="ghost" size="icon" aria-label="Open Menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-72" aria-label="Navigation Menu">

                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>

                  <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}

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

      {/* Hero Section */}
      <section className="w-full bg-primary/5 dark:bg-primary/20 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 text-center">
              <Badge variant="outline" className="border-primary/20 text-primary bg-primary/10 mb-6 px-4 py-1.5">
                Trusted by 50,000+ patients nationwide
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Your Health, Your <span className="text-primary">Schedule</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Book appointments with top-rated doctors, manage your prescriptions, and take full control of your healthcare journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2 px-8">
                    Book Your Appointment <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-accent px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="mt-16 mx-auto max-w-4xl rounded-xl border border-border bg-card/50 overflow-hidden shadow-2xl">
                <div className="bg-muted/30 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-4 bg-muted rounded-md h-6 flex items-center px-3">
                    <span className="text-xs text-muted-foreground">app.clinicapp.com/patient/dashboard</span>
                  </div>
                </div>
                <div className="h-56 bg-gradient-to-br from-background to-muted flex items-center justify-center">
                  <div className="grid grid-cols-3 gap-4 px-8 w-full max-w-md">
                    {
                      [{ icon: Calendar, label: "Upcoming", value: "3" }, { icon: Pill, label: "Prescriptions", value: "5" }, { icon: Users, label: "Doctors", value: "12" }].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="bg-card rounded-lg p-4 text-center border border-border">
                          <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                          <div className="text-2xl font-bold text-foreground">{value}</div>
                          <div className="text-xs text-muted-foreground">{label}</div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="w-full bg-muted/40 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 text-center">
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium mb-8">
                Trusted by leading healthcare institutions
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
                {
                  ["MedCore Hospital", "St. Mary's Clinic", "HealthPlus Network", "City Medical Center", "Prime Health"].map((name) => (
                    <div key={name} className="text-lg font-bold text-muted-foreground">
                      {name}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full py-20 bg-background dark:bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 text-center mb-4">
              <Badge className="mb-4 ">
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Everything you need for better healthcare
              </h2>
            </div>

            {
              features.map(({ icon: Icon, title, description }) => (
                <div key={title} className="col-span-12 md:col-span-4">
                  <Card className="h-full bg-background border-border hover:shadow-lg transition-shadow dark:bg-card">
                    <CardHeader>
                      {/* Perfect square icon container - works on all devices */}
                      <div className="relative aspect-square w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg text-foreground">
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full bg-muted/40 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 text-center mb-4">
              <Badge className="mb-4">
                How it works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Get started in 4 simple steps
              </h2>
            </div>
            {steps.map(({ num, title, description }) => (
              <div key={num} className="col-span-12 sm:col-span-6 lg:col-span-3">
                <Card className="h-full bg-background border-border text-center hover:shadow-lg transition-shadow dark:bg-card">
                  <CardContent className="pt-8 pb-6">

                    <div className="relative aspect-square w-14 mx-auto mb-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <span className="text-xl font-bold leading-none translate-y-px">
                        {num}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Featured Doctors */}

      <section id="doctors" className="w-full py-20 bg-background dark:bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 text-center mb-4">
              <Badge className="mb-4">
                Our Doctors
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Meet our top-rated specialists
              </h2>
            </div>
            {
              doctors.map((doctor) => (
                <div key={doctor.name} className="col-span-12 sm:col-span-6 lg:col-span-3">
                  <Card className="h-full bg-background border-border hover:shadow-xl transition-all hover:-translate-y-1 duration-200 dark:bg-card">
                    <CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-3">
                      <div className="relative aspect-square w-16 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-semibold leading-none translate-y-px">
                          {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-foreground">
                          {doctor.name}
                        </h3>
                        <Badge variant="secondary" className="mt-1 text-xs bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground">
                          {doctor.specialization}
                        </Badge>
                      </div>
                      <StarRating rating={Math.floor(doctor.rating)} />
                      <p className="text-xs text-muted-foreground">
                        {doctor.rating} ({doctor.reviews} reviews)
                      </p>
                      <Link href="/auth/register" className="w-full">
                        <Button size="sm" className="w-full gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                          Book Now
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              ))
            }
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="w-full bg-muted/40 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 text-center mb-4">
              <Badge className="mb-4">
                Testimonials
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                What our users say
              </h2>
            </div>
            {testimonials.map((t) => (
              <div key={t.name} className="col-span-12 md:col-span-4">
                <Card className="h-full bg-background border-border hover:shadow-lg transition-shadow dark:bg-card">
                  <CardContent className="pt-6 flex flex-col gap-4">
                    <StarRating rating={t.rating} />
                    <p className="text-muted-foreground text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3 mt-auto pt-2 border-t border-border">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold leading-none">
                          {t.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}

      <section id="pricing" className="w-full py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 text-center mb-4">
              <Badge className="mb-4">Pricing</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, transparent pricing
              </h2>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className={`text-sm font-medium ${!yearlytBilling ? "text-foreground" : "text-muted-foreground"}`}>Monthly
                </span>
                <Switch checked={yearlytBilling} onCheckedChange={setYearlyBilling}
                  aria-label="Toggle yearly billing"
                />
                <span className={`text-sm font-medium ${yearlytBilling ? "text-foreground" : "text-muted-foreground"}`}>
                  Yearly <Badge variant="secondary" className="text-xs ml-1">Save 30%</Badge>
                </span>
              </div>
            </div>

            {pricingPlans.map((plan) => (
              <div key={plan.name} className="col-span-12 md:col-span-4">
                <Card className={
                  `h-full flex flex-col ${plan.highlighted ? "border-primary shadow-xl scale-105" : "hover:shadow-lg transition-shadow"}`
                }>
                  <CardHeader>
                    {
                      plan.highlighted && <Badge className="w-fit mb-2 bg-primary">
                        Most Popular
                      </Badge>
                    }

                    <CardTitle className="text-xl">
                      {plan.name}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {plan.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${
                          yearlytBilling ? plan.yearlyPrice : plan.monthlyPrice
                        }
                      </span>
                      <span className="text-muted-foreground ml-1 text-sm"> / {yearlytBilling ? "year" : "month"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-4">
                    <ul className="space-y-2.5">
                      {
                        plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            {feature}
                          </li>
                        ))
                      }
                    </ul>
                    <div className="mt-auto pt-4">
                      <Link href="/auth/register" className="block">
                        <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}




          </div>
        </div>
      </section >


      {/*FAQ*/}
      <section id="faq" className="w-full bg-muted/40 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 text-center mb-4">
              <Badge className="mb-4">
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently asked questions
              </h2>
            </div>
            <div className="col-span-12 max-w-3xl mx-auto w-full">
              <Accordion type="single" collapsible className="space-y-2">
                {
                  faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-lg border px-4 py-5">

                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed mt-3">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))
                }
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full bg-gradient-to-r from-primary/90 to-secondary dark:from-primary/30 dark:to-secondary/80 py-20 relative overflow-hidden">
        {/* Subtle pattern or glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent dark:from-primary/10 dark:to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white dark:text-foreground">
                Start your healthcare journey today
              </h2>
              <p className="text-white/80 dark:text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of patients already using ClinicApp for seamless healthcare management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 gap-2 px-8">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 dark:border-border dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground px-8">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-background dark:bg-card border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-3">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <Stethoscope className="h-6 w-6 text-primary" />
                <span className="text-foreground">ClinicApp</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Professional healthcare management platform connecting patients with top-rated doctors.
              </p>
              <div className="flex gap-4">
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07C2 17.1 5.66 21.27 10.44 22v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.9h-2.33V22C18.34 21.27 22 17.1 22 12.07z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.48 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4V8zm7.5 0h3.84v2.16h.05c.54-1.02 1.86-2.16 3.83-2.16 4.1 0 4.86 2.7 4.86 6.2V24h-4v-7.1c0-1.7-.03-3.88-2.37-3.88-2.37 0-2.73 1.85-2.73 3.76V24h-4V8z" />
                  </svg>
                </a>
                {/* X / Twitter */}
                <a
                  href="#"
                  aria-label="X / Twitter"
                  className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M18.9 2H22l-6.77 7.73L23 22h-6.95l-5.44-7.1L4.4 22H1.3l7.24-8.27L1 2h7.13l4.92 6.48L18.9 2zm-1.22 18h1.93L7.08 3.9H5.02L17.68 20z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="col-span-6 md:col-span-3">
              <h3 className="font-semibold mb-4 text-card-foreground dark:text-foreground">Platform</h3>
              <ul className="space-y-2.5">
                {["Find Doctors", "Book Appointment", "Medical Records", "Prescriptions"].map((link) => (
                  <li key={link}>
                    <Link href="/auth/register" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-6 md:col-span-3">
              <h3 className="font-semibold mb-4 text-card-foreground dark:text-foreground">Company</h3>
              <ul className="space-y-2.5">
                {["About Us", "Careers", "Blog", "Privacy Policy", "Terms of Service"].map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 md:col-span-3">
              <h3 className="font-semibold mb-4 text-card-foreground dark:text-foreground">Stay Updated</h3>
              <div className="flex gap-2 mb-6">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-input/10 border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                  Subscribe
                </Button>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Phone className="h-4 w-4 text-primary" />+92 315 4283714
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Mail className="h-4 w-4 text-primary" />support@clinicapp.com
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4 text-primary" />Street no 16 Hostel City, Lane 10, Park Road, Islamabad
                </div>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-border" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground/70 text-sm">© {new Date().getFullYear()} ClinicApp. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Cookies"].map((link) => (
                <Link key={link} href="#" className="text-muted-foreground/70 text-sm hover:text-foreground transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div >
  )
}

export default LandingPage