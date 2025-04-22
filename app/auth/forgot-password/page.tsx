"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Dumbbell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useThemeContext } from "@/contexts/theme-context"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const { theme } = useThemeContext()
  const [mounted, setMounted] = useState(false)

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSubmitted(true)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) {
    return null // Avoid rendering with incorrect theme
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="flex items-center gap-2 font-bold text-2xl text-teal-600 mb-8">
        <Dumbbell className="h-8 w-8" />
        <span>Flex Time</span>
      </div>

      <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
          <CardDescription className={`text-center ${theme === "dark" ? "text-gray-400" : ""}`}>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <Alert
              className={
                theme === "dark"
                  ? "bg-green-900 text-green-100 border-green-800"
                  : "bg-green-50 text-green-800 border-green-200"
              }
            >
              <AlertDescription>
                If an account exists with the email <span className="font-medium">{email}</span>, you will receive a
                password reset link shortly. Please check your email.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-muted-foreground"}`}>
            Remember your password?{" "}
            <Link href="/auth/login" className="text-teal-600 hover:underline">
              Back to login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
