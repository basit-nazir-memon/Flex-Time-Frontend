"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, MapPin, Search, User, Loader2 } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"
import { toast } from "sonner"

interface Booking {
  id: string
  className: string
  trainer: string
  date: string
  startTime: string
  endTime: string
  location: string
  status: "upcoming" | "completed" | "cancelled"
  type: string
}

export default function UserBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          toast.error("Please login to view your bookings")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch bookings")
        }

        const data = await response.json()
        setBookings(data)
      } catch (error) {
        toast.error("Failed to load bookings", {
          description: error instanceof Error ? error.message : "Please try again later"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.trainer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = booking.status === activeTab

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <AppLayout userRole="user" userName="Jane User">
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout userRole="user" userName="Jane User">
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your class bookings.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No upcoming bookings found.</p>
                  <Button className="mt-4 bg-teal-600 hover:bg-teal-700" asChild>
                    <a href="/user/classes">Browse Classes</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              booking.type === "hiit"
                                ? "bg-red-500"
                                : booking.type === "yoga"
                                  ? "bg-blue-500"
                                  : booking.type === "strength"
                                    ? "bg-purple-500"
                                    : booking.type === "pilates"
                                      ? "bg-pink-500"
                                      : booking.type === "cardio"
                                        ? "bg-orange-500"
                                        : "bg-green-500"
                            }
                          >
                            {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                          </Badge>
                          <h3 className="text-lg font-bold">{booking.className}</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{booking.trainer}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No completed bookings found.</p>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              booking.type === "hiit"
                                ? "bg-red-500"
                                : booking.type === "yoga"
                                  ? "bg-blue-500"
                                  : booking.type === "strength"
                                    ? "bg-purple-500"
                                    : booking.type === "pilates"
                                      ? "bg-pink-500"
                                      : booking.type === "cardio"
                                        ? "bg-orange-500"
                                        : "bg-green-500"
                            }
                          >
                            {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                          </Badge>
                          <h3 className="text-lg font-bold">{booking.className}</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{booking.trainer}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Leave Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No cancelled bookings found.</p>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              booking.type === "hiit"
                                ? "bg-red-500"
                                : booking.type === "yoga"
                                  ? "bg-blue-500"
                                  : booking.type === "strength"
                                    ? "bg-purple-500"
                                    : booking.type === "pilates"
                                      ? "bg-pink-500"
                                      : booking.type === "cardio"
                                        ? "bg-orange-500"
                                        : "bg-green-500"
                            }
                          >
                            {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                          </Badge>
                          <h3 className="text-lg font-bold">{booking.className}</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{booking.trainer}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
