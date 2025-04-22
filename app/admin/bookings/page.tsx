"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2 } from "lucide-react"
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
  const [activeTab, setActiveTab] = useState("confirmed")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [router])

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token")
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
      booking.trainer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = booking.status === activeTab

    return matchesSearch && matchesStatus
  })

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

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookings by class, user, trainer, or location..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                  <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                    Clear Search
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
                        <div>
                          <p className="font-medium">{booking.className}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString()} • {booking.startTime} - {booking.endTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            User: {booking.user} ({booking.userEmail})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Trainer: {booking.trainer} • Location: {booking.location}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
                          <Badge variant="outline" className="capitalize">
                            {booking.type}
                          </Badge>
                          <Badge variant="default">Confirmed</Badge>
                        </div>
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
                  <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                    Clear Search
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
                        <div>
                          <p className="font-medium">{booking.className}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString()} • {booking.startTime} - {booking.endTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            User: {booking.user} ({booking.userEmail})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Trainer: {booking.trainer} • Location: {booking.location}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
                          <Badge variant="outline" className="capitalize">
                            {booking.type}
                          </Badge>
                          <Badge variant="destructive">Cancelled</Badge>
                        </div>
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
                  <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                    Clear Search
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
                        <div>
                          <p className="font-medium">{booking.className}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString()} • {booking.startTime} - {booking.endTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            User: {booking.user} ({booking.userEmail})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Trainer: {booking.trainer} • Location: {booking.location}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
                          <Badge variant="outline" className="capitalize">
                            {booking.type}
                          </Badge>
                          <Badge variant="secondary">Completed</Badge>
                        </div>
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