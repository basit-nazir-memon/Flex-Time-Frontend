"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Search, User, MoreHorizontal, Plus, Loader2 } from "lucide-react"
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
  status: 'completed' | 'upcoming'
}

export default function AdminClassesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedTrainer, setSelectedTrainer] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
  }, [router])

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token")
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

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      classItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.trainer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classItem.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || !selectedType ? true : classItem.type === selectedType
    const matchesTrainer = selectedTrainer === "all" || !selectedTrainer ? true : classItem.trainer === selectedTrainer
    const matchesStatus = classItem.status === activeTab

    return matchesSearch && matchesType && matchesTrainer && matchesStatus
  })

  // Get unique trainers for filter
  const trainers = [...new Set(classes.map((cls) => cls.trainer))]

  if (isLoading) {
    return (
      <AppLayout userRole="admin" userName="Admin User">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
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
            <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
            <p className="text-muted-foreground">Manage all classes in the platform.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search classes by title, trainer, or location..."
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

        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
            <TabsTrigger value="completed">Completed Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {filteredClasses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No upcoming classes found matching your criteria.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedType("")
                      setSelectedTrainer("")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Classes</CardTitle>
                  <CardDescription>Classes that are yet to be conducted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredClasses.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
                      >
                        <div>
                          <p className="font-medium">{classItem.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(classItem.date).toLocaleDateString()} • {classItem.startTime} - {classItem.endTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Trainer: {classItem.trainer} • Location: {classItem.location}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">{classItem.booked}/{classItem.capacity}</span>
                            <span className="text-xs text-muted-foreground">Booked/Capacity</span>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {classItem.type}
                          </Badge>
                          <Badge variant={classItem.status === "upcoming" ? "default" : "secondary"}>
                            {classItem.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredClasses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No completed classes found matching your criteria.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedType("")
                      setSelectedTrainer("")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Completed Classes</CardTitle>
                  <CardDescription>Classes that have been conducted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredClasses.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
                      >
                        <div>
                          <p className="font-medium">{classItem.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(classItem.date).toLocaleDateString()} • {classItem.startTime} - {classItem.endTime}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Trainer: {classItem.trainer} • Location: {classItem.location}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">{classItem.booked}/{classItem.capacity}</span>
                            <span className="text-xs text-muted-foreground">Booked/Capacity</span>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {classItem.type}
                          </Badge>
                          <Badge variant={classItem.status === "upcoming" ? "default" : "secondary"}>
                            {classItem.status}
                          </Badge>
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
