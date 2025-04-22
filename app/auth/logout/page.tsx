"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear all authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('user')

    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'

    // Redirect to login page
    router.push('/auth/login')
  }, [router])

  // This page will be shown very briefly before the redirect
  return null
} 