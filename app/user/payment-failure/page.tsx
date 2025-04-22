"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"

export default function PaymentFailurePage() {
  const router = useRouter()

  return (
    <AppLayout userRole="user" userName="Jane User">
      <div className="flex flex-col items-center justify-center min-h-[80vh] pb-20 md:pb-0">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Payment Failed</CardTitle>
            <CardDescription>We couldn't process your payment. Please try again.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-red-50 text-red-800">
              <p className="font-medium">Possible reasons for failure:</p>
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>Insufficient funds in your account</li>
                <li>Card expired or invalid</li>
                <li>Transaction declined by your bank</li>
                <li>Network or connection issues</li>
              </ul>
            </div>

            <div className="text-center text-muted-foreground">
              <p>If you continue to experience issues, please contact our support team.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => router.push("/user/packages")}>
              Try Again
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push("/user")}>
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  )
}
