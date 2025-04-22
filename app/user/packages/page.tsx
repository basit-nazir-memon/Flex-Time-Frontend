"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, CreditCard, Clock, Loader2 } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"
import { toast } from "sonner"
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const CheckoutForm = ({ packageType, amount, onSuccess, onError }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    try {
      const token = mounted ? localStorage.getItem("token") : null
      if (!token) {
        toast.error("Please login to purchase a package")
        return
      }

      // Create payment intent
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageType,
          amount,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment intent")
      }

      const { clientSecret } = await response.json()

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (result.error) {
        onError(result.error.message)
      } else {
        if (result.paymentIntent.status === "succeeded") {
          onSuccess()
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "Payment failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border rounded-md p-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-teal-600 hover:bg-teal-700"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  )
}

export default function PackagesPage() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  // const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/webhook`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({}),
  // })

  const handlePaymentSuccess = () => {
    const packageDetails = {
      type: selectedPackage,
      name: selectedPackage === "standard" ? "Standard Package" : "Premium Package",
      hours: selectedPackage === "standard" ? "10 Hours" : "20 Hours",
      price: selectedPackage === "standard" ? "350.00" : "600.00",
      validity: selectedPackage === "standard" ? "3 months" : "6 months",
    }

    const queryParams = new URLSearchParams({
      type: packageDetails.type,
      name: packageDetails.name,
      hours: packageDetails.hours,
      price: packageDetails.price,
      validity: packageDetails.validity,
    } as Record<string, string>)

    toast.success("Payment successful!")
    router.push(`/user/payment-success?${queryParams.toString()}`)
  }

  const handlePaymentError = (error: string) => {
    toast.error("Payment failed", {
      description: error,
    })
  }

  return (
    <AppLayout userRole="user" userName="Jane User">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Choose a Package</h1>
          <p className="text-muted-foreground">Select a package that suits your fitness needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={`border-2 ${selectedPackage === "standard" ? "border-teal-600" : "border-transparent"}`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Standard Package</span>
                <span className="text-2xl font-bold">$350</span>
              </CardTitle>
              <CardDescription>Perfect for occasional fitness enthusiasts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-600" />
                <span className="font-medium">10 Hours</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5" />
                  <span>Access to all fitness classes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5" />
                  <span>Valid for 3 months</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5" />
                  <span>Book classes up to 1 week in advance</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={selectedPackage === "standard" ? "default" : "outline"}
                className={`w-full ${selectedPackage === "standard" ? "bg-teal-600 hover:bg-teal-700" : ""}`}
                onClick={() => setSelectedPackage("standard")}
              >
                {selectedPackage === "standard" ? "Selected" : "Select Package"}
              </Button>
            </CardFooter>
          </Card>

          <Card className={`border-2 ${selectedPackage === "premium" ? "border-teal-600" : "border-transparent"}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Premium Package</CardTitle>
                <span className="text-2xl font-bold">$600</span>
              </div>
              <CardDescription>Ideal for dedicated fitness enthusiasts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-600" />
                <span className="font-medium">20 Hours</span>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5" />
                  <span>Access to all fitness classes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5" />
                  <span>Valid for 6 months</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5" />
                  <span>Book classes up to 2 weeks in advance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-teal-600 mt-0.5" />
                  <span>Priority booking for popular classes</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant={selectedPackage === "premium" ? "default" : "outline"}
                className={`w-full ${selectedPackage === "premium" ? "bg-teal-600 hover:bg-teal-700" : ""}`}
                onClick={() => setSelectedPackage("premium")}
              >
                {selectedPackage === "premium" ? "Selected" : "Select Package"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {selectedPackage && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Complete your purchase securely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 bg-muted/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Order Summary</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      {selectedPackage === "standard" ? "Standard Package (10 Hours)" : "Premium Package (20 Hours)"}
                    </span>
                    <span>${selectedPackage === "standard" ? "350.00" : "600.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${selectedPackage === "standard" ? "350.00" : "600.00"}</span>
                  </div>
                </div>
              </div>

              <Elements stripe={stripePromise}>
                <CheckoutForm
                  packageType={selectedPackage}
                  amount={selectedPackage === "standard" ? 35000 : 60000}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
