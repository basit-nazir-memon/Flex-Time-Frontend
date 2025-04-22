"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Calendar } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"

interface PackageDetails {
  type: string
  name: string
  hours: string
  price: string
  validity: string
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  const [packageDetails, setPackageDetails] = useState<PackageDetails>({
    type: searchParams.get("type") || "",
    name: searchParams.get("name") || "",
    hours: searchParams.get("hours") || "",
    price: searchParams.get("price") || "",
    validity: searchParams.get("validity") || "",
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/user")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <AppLayout userRole="user" userName="Jane User">
      <div className="flex flex-col items-center justify-center min-h-[80vh] pb-20 md:pb-0">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>Your package has been purchased successfully.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex justify-between mb-2">
                <span>Package</span>
                <span className="font-medium">{packageDetails.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Hours</span>
                <span className="font-medium">{packageDetails.hours}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Validity</span>
                <span className="font-medium">{packageDetails.validity}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid</span>
                <span className="font-medium">${packageDetails.price}</span>
              </div>
            </div>

            <div className="text-center text-muted-foreground">
              <p>
                You will be redirected to your dashboard in {countdown} second{countdown !== 1 ? "s" : ""}...
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => router.push("/user")}>
              Go to Dashboard
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/user/classes")}>
              Browse Classes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  )
}
