"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, User, Loader2 } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Class {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  capacity: number
  booked: number
  type: string
  trainer: string
  status: string
}

export default function AdminCalendarPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch classes")
      }

      const data = await response.json()
      setClasses(data)
    } catch (error) {
      toast.error("Failed to load classes", {
        description: error instanceof Error ? error.message : "Please try again later"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const redirectToGoogleCalendar = () => {
    window.open(`https://calendar.google.com/calendar`, "_blank")
  }

  const filteredClasses = classes.filter((classItem) => {
    const today = new Date()
    const classDate = new Date(classItem.date)
    return activeTab === "upcoming" ? classDate >= today : classDate < today
  })

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <AppLayout userRole="admin" userName="Admin User">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">Loading classes...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="text-muted-foreground">View and manage class schedule.</p>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <Button 
              variant="outline" 
              size="sm" 
              className="text-blue-500 hover:text-blue-700" 
              onClick={redirectToGoogleCalendar}
            >
              View Google Calendar
            </Button>
          </div>

          <TabsContent value="upcoming" className="space-y-4">
            {filteredClasses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No upcoming classes found.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Classes</CardTitle>
                  <CardDescription>Classes scheduled for the future</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredClasses.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                classItem.type === "hiit"
                                  ? "bg-red-500"
                                  : classItem.type === "yoga"
                                    ? "bg-blue-500"
                                    : classItem.type === "strength"
                                      ? "bg-purple-500"
                                      : classItem.type === "pilates"
                                        ? "bg-pink-500"
                                        : classItem.type === "cardio"
                                          ? "bg-orange-500"
                                          : classItem.type === "boxing"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                              }
                            >
                              {classItem.type.charAt(0).toUpperCase() + classItem.type.slice(1)}
                            </Badge>
                            <h3 className="font-medium">{classItem.title}</h3>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(classItem.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {classItem.startTime} - {classItem.endTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{classItem.location}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Trainer: {classItem.trainer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Capacity: {classItem.booked}/{classItem.capacity}</span>
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex items-center gap-4 mt-2 md:mt-0">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                              Cancel
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

          <TabsContent value="past" className="space-y-4">
            {filteredClasses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No past classes found.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Past Classes</CardTitle>
                  <CardDescription>Classes that have already occurred</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredClasses.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                classItem.type === "hiit"
                                  ? "bg-red-500"
                                  : classItem.type === "yoga"
                                    ? "bg-blue-500"
                                    : classItem.type === "strength"
                                      ? "bg-purple-500"
                                      : classItem.type === "pilates"
                                        ? "bg-pink-500"
                                        : classItem.type === "cardio"
                                          ? "bg-orange-500"
                                          : classItem.type === "boxing"
                                            ? "bg-yellow-500"
                                            : "bg-green-500"
                              }
                            >
                              {classItem.type.charAt(0).toUpperCase() + classItem.type.slice(1)}
                            </Badge>
                            <h3 className="font-medium">{classItem.title}</h3>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(classItem.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {classItem.startTime} - {classItem.endTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{classItem.location}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Trainer: {classItem.trainer}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Capacity: {classItem.booked}/{classItem.capacity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
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
