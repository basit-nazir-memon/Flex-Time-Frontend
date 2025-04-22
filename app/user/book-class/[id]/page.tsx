"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, User, Users, CreditCard, CheckCircle, Loader2 } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"
import { toast } from "sonner"

interface ClassData {
  id: string
  title: string
  trainer: string
  trainerBio: string
  date: string
  startTime: string
  endTime: string
  location: string
  capacity: number
  booked: number
  type: string
  description: string
  price: string
  requirements: string
  isRecurringClass: boolean
  frequency: string | null
  endDate: string | null
}

export default function BookClassPage() {
  const router = useRouter()
  const [isBooking, setIsBooking] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [classData, setClassData] = useState<ClassData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/classes/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch class details")
        }

        const data = await response.json()
        setClassData(data)
        toast.success("Class details loaded")
      } catch (error) {
        toast.error("Failed to load class details", {
          description: error instanceof Error ? error.message : "Please try again later"
        })
        router.push("/user/classes")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClassData()
  }, [params.id, router])

  const handleBookClass = async () => {
    try {
      setIsBooking(true)
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          classId: params.id
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to book class")
      }

      const data = await response.json()
      setBookingComplete(true)
      toast.success("Booking confirmed", {
        description: "Your class has been booked successfully"
      })

      setTimeout(() => {
        router.push("/user/bookings")
      }, 2000)
    } catch (error) {
      toast.error("Booking failed", {
        description: error instanceof Error ? error.message : "Please try again later"
      })
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <AppLayout userRole="user" userName="Jane User">
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    )
  }

  if (!classData) {
    return null
  }

  return (
    <AppLayout userRole="user" userName="Jane User">
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Book Class</h1>
          <p className="text-muted-foreground">Review class details and confirm your booking.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        classData.type === "hiit"
                          ? "bg-red-500"
                          : classData.type === "yoga"
                            ? "bg-blue-500"
                            : classData.type === "strength"
                              ? "bg-purple-500"
                              : classData.type === "pilates"
                                ? "bg-pink-500"
                                : classData.type === "cardio"
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                      }
                    >
                      {classData.type.charAt(0).toUpperCase() + classData.type.slice(1)}
                    </Badge>
                    <CardTitle>{classData.title}</CardTitle>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">
                      {classData.booked}/{classData.capacity}
                    </span>{" "}
                    booked
                  </div>
                </div>
                <CardDescription>Review the class details below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-muted-foreground">{new Date(classData.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Time</p>
                        <p className="text-sm text-muted-foreground">
                          {classData.startTime} - {classData.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{classData.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Trainer</p>
                        <p className="text-sm text-muted-foreground">{classData.trainer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Class Size</p>
                        <p className="text-sm text-muted-foreground">{classData.capacity} participants maximum</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Price</p>
                        <p className="text-sm text-muted-foreground">{classData.price} from your package</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Description</p>
                  <p className="text-sm text-muted-foreground">{classData.description}</p>
                </div>

                <div>
                  <p className="font-medium mb-2">What to Bring</p>
                  <p className="text-sm text-muted-foreground">{classData.requirements}</p>
                </div>

                {classData.isRecurringClass && (
                  <div>
                    <p className="font-medium mb-2">Recurring Class Details</p>
                    <p className="text-sm text-muted-foreground">
                      This is a recurring class that occurs {classData.frequency?.toLowerCase()} until {new Date(classData.endDate!).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About the Trainer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg" alt={classData.trainer} />
                    <AvatarFallback>{classData.trainer.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{classData.trainer}</h3>
                    <p className="text-sm text-muted-foreground">Fitness Trainer</p>
                  </div>
                </div>
                <p className="text-sm">{classData.trainerBio}</p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
                <CardDescription>Review your booking details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Class</span>
                  <span className="font-medium">{classData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date</span>
                  <span>{new Date(classData.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time</span>
                  <span>
                    {classData.startTime} - {classData.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span>{classData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trainer</span>
                  <span>{classData.trainer}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium">
                    <span>Hours Required</span>
                    <span>{classData.price}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                {bookingComplete ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 p-2 bg-green-50 rounded-md w-full">
                    <CheckCircle className="h-5 w-5" />
                    <span>Booking Confirmed!</span>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    onClick={handleBookClass}
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                )}
                <Button variant="outline" className="w-full" onClick={() => router.back()} disabled={isBooking}>
                  Back to Classes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
