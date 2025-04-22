"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Search, User, MoreHorizontal, Loader2 } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Booking {
  id: string
  className: string
  trainer: string
  user: string
  userEmail: string
  date: string
  startTime: string
  endTime: string
  location: string
  status: string
  type: string
}

export default function AdminBookingsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedTrainer, setSelectedTrainer] = useState("")
  const [activeTab, setActiveTab] = useState("confirmed")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/admin`, {
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

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.trainer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType ? booking.type === selectedType : true
    const matchesTrainer = selectedTrainer === "all" || !selectedTrainer ? true : booking.trainer === selectedTrainer
    const matchesStatus = booking.status === activeTab

    return matchesSearch && matchesType && matchesTrainer && matchesStatus
  })

  // Get unique trainers for filter
  const trainers = [...new Set(bookings.map((booking) => booking.trainer))]

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <AppLayout userRole="admin" userName="Admin User">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
            <p className="text-muted-foreground">Loading bookings...</p>
          </div>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout userRole="admin" userName="Admin User">
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
            <p className="text-muted-foreground">Manage all class bookings.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookings by class, user, trainer, or location..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select onValueChange={setSelectedType} value={selectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Class type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="hiit">HIIT</SelectItem>
                <SelectItem value="yoga">Yoga</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="pilates">Pilates</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="dance">Dance</SelectItem>
                <SelectItem value="boxing">Boxing</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedTrainer} value={selectedTrainer}>
              <SelectTrigger>
                <SelectValue placeholder="Trainer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All trainers</SelectItem>
                {trainers.map((trainer) => (
                  <SelectItem key={trainer} value={trainer}>
                    {trainer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="confirmed" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="confirmed" className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No confirmed bookings found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setSearchQuery("")
                    setSelectedType("")
                    setSelectedTrainer("")
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Confirmed Bookings</CardTitle>
                  <CardDescription>Bookings that are confirmed and upcoming</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
                      >
                        <div className="space-y-1">
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
                                          : booking.type === "boxing"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                              }
                            >
                              {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                            </Badge>
                            <h3 className="font-medium">{booking.className}</h3>
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
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Trainer: {booking.trainer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>User: {booking.user}</span>
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex items-center gap-4 mt-2 md:mt-0">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                              Cancel
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div> */}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No completed bookings found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setSearchQuery("")
                    setSelectedType("")
                    setSelectedTrainer("")
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Completed Bookings</CardTitle>
                  <CardDescription>Bookings that have been completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
                      >
                        <div className="space-y-1">
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
                                          : booking.type === "boxing"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                              }
                            >
                              {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                            </Badge>
                            <h3 className="font-medium">{booking.className}</h3>
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
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Trainer: {booking.trainer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>User: {booking.user}</span>
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex items-center gap-4 mt-2 md:mt-0">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div> */}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No cancelled bookings found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => {
                    setSearchQuery("")
                    setSelectedType("")
                    setSelectedTrainer("")
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Cancelled Bookings</CardTitle>
                  <CardDescription>Bookings that have been cancelled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
                      >
                        <div className="space-y-1">
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
                                          : booking.type === "boxing"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                              }
                            >
                              {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                            </Badge>
                            <h3 className="font-medium">{booking.className}</h3>
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
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Trainer: {booking.trainer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>User: {booking.user}</span>
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex items-center gap-4 mt-2 md:mt-0">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div> */}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}