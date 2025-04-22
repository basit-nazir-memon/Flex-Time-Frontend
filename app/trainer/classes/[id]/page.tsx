"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Edit, Trash, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AppLayout from "@/components/layout/app-layout"

// Sample class data (in a real app, this would be fetched based on the ID)
const classData = {
  id: 1,
  title: "HIIT Workout",
  date: "2023-06-15",
  startTime: "10:00",
  endTime: "11:00",
  location: "Studio 1",
  capacity: 15,
  booked: 8,
  type: "hiit",
  description:
    "High-Intensity Interval Training (HIIT) combines short periods of intense exercise with less intense recovery periods. This class is designed to get your heart rate up and burn fat in less time. Suitable for all fitness levels with modifications provided.",
  requirements: "Comfortable workout clothes, water bottle, towel. Bring your own mat if preferred.",
  attendees: [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "confirmed" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", status: "confirmed" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", status: "confirmed" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", status: "confirmed" },
    { id: 5, name: "Edward Norton", email: "edward@example.com", status: "confirmed" },
    { id: 6, name: "Fiona Gallagher", email: "fiona@example.com", status: "confirmed" },
    { id: 7, name: "George Miller", email: "george@example.com", status: "confirmed" },
    { id: 8, name: "Hannah Baker", email: "hannah@example.com", status: "confirmed" },
  ],
}

export default function ClassDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      router.push("/trainer/classes")
    }, 1500)
  }

  return (
    <AppLayout userRole="trainer" userName="John Trainer">
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Class Details</h1>
            <p className="text-muted-foreground">View and manage your class information.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/trainer/classes/${params.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Class
            </Button>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Cancel Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cancel Class</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel this class? This action cannot be undone and all students will be
                    notified.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2 p-4 bg-amber-50 text-amber-800 rounded-md">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">
                    {classData.booked} students are currently booked for this class and will be affected.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Cancelling..." : "Yes, Cancel Class"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
                <CardDescription>Class details and information</CardDescription>
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
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Class Size</p>
                        <p className="text-sm text-muted-foreground">{classData.capacity} participants maximum</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Current Bookings</p>
                        <p className="text-sm text-muted-foreground">
                          {classData.booked} participants ({Math.round((classData.booked / classData.capacity) * 100)}%
                          full)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Description</p>
                  <p className="text-sm text-muted-foreground">{classData.description}</p>
                </div>

                <div>
                  <p className="font-medium mb-2">Requirements</p>
                  <p className="text-sm text-muted-foreground">{classData.requirements}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendees</CardTitle>
                <CardDescription>Students who have booked this class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classData.attendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" alt={attendee.name} />
                          <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{attendee.name}</p>
                          <p className="text-sm text-muted-foreground">{attendee.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        {attendee.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Export Attendee List
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your class</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  onClick={() => router.push(`/trainer/classes/${params.id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Class Details
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Message Attendees
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Reschedule Class
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Duplicate Class</CardTitle>
                <CardDescription>Create a copy of this class</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a new class with the same details. You can modify the date, time, and other information before
                  publishing.
                </p>
                <Button className="w-full" variant="outline" onClick={() => router.push("/trainer/classes/create")}>
                  Duplicate Class
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
