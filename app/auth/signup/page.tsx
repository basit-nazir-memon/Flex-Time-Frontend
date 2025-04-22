"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useThemeContext } from "@/contexts/theme-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import config from "../../../config"
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
export default function SignupPage() {
  const router = useRouter()
  const [role, setRole] = useState<"user" | "trainer">("user")
  const { theme } = useThemeContext()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("") // Clear error when user types
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          type: role
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // Registration successful
      setSuccess(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return null // Avoid rendering with incorrect theme
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="flex items-center gap-2 font-bold text-2xl text-teal-600 mb-8">
        <Dumbbell className="h-8 w-8" />
        <span>Flex Time</span>
      </div>

      <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className={`text-center ${theme === "dark" ? "text-gray-400" : ""}`}>
            Sign up to get started with Flex Time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className={theme === "dark" ? "bg-green-900 text-green-100 border-green-800" : "bg-green-50 text-green-800 border-green-200"}>
              <AlertDescription>
                Registration successful! Redirecting to login page...
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <Tabs defaultValue="user" className="w-full mb-6" onValueChange={(value) => setRole(value as any)}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="user">User</TabsTrigger>
                  <TabsTrigger value="trainer">Trainer</TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-500 mt-2">{error}</p>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${theme === "dark" ? "border-gray-700" : ""}`}></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className={`px-2 ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-muted-foreground"}`}>
                    Or continue with
                  </span>
                </div>
              </div>

              {/* <Button variant="outline" className="w-full" type="button" disabled={isLoading}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="4"></circle>
                  <line x1="21.17" x2="12" y1="8" y2="8"></line>
                  <line x1="3.95" x2="8.54" y1="6.06" y2="14"></line>
                  <line x1="10.88" x2="15.46" y1="21.94" y2="14"></line>
                </svg>
                Google
              </Button> */}

              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    // Send the Google ID token to your backend
                    fetch( `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/token-login`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        token: credentialResponse.credential,
                      }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        localStorage.setItem("token", data.token);
                        localStorage.setItem("role", data.user.role);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        localStorage.setItem("name", data.user.name);
                        localStorage.setItem("avatar", data.user.avatar);

                        // console.log(data);

                        // Redirect based on the role returned from the server
                        setTimeout(() => {
                          router.push(`/${data.user.role}`);
                        }, 1000);
                      });
                  }}
                  onError={() => console.log("Google Login Failed")}
                />
              </GoogleOAuthProvider>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-muted-foreground"}`}>
            Already have an account?{" "}
            <Link href="/auth/login" className="text-teal-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
