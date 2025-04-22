"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Search, User, Loader2 } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"
import { toast } from "sonner"

interface Class {
  id: string
  title: string
  trainer: string
  date: string
  startTime: string
  endTime: string
  location: string
  capacity: number
  booked: number
  type: string
}

export default function ClassesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedTrainer, setSelectedTrainer] = useState("")
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = mounted ? localStorage.getItem("token") : null
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

    if (typeof window !== "undefined") {
      fetchClasses()
    }
  }, [router])

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.trainer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDate = selectedDate === "all" || !selectedDate ? true : cls.date === selectedDate
    const matchesType = selectedType === "all" || !selectedType ? true : cls.type === selectedType
    const matchesTrainer = selectedTrainer === "all" || !selectedTrainer ? true : cls.trainer === selectedTrainer

    return matchesSearch && matchesDate && matchesType && matchesTrainer
  })

  // Add a function to handle booking a class
  const handleBookClass = (classId: string) => {
    router.push(`/user/book-class/${classId}`)
  }

  // Get unique trainers for filter
  const trainers = [...new Set(classes.map((cls) => cls.trainer))]

  if (isLoading) {
    return (
      <AppLayout userRole="user" userName="Jane User">
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    )
  }

  if (!mounted) {
    return null
  }

  return (
    <AppLayout userRole="user" userName="Jane User">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Classes</h1>
          <p className="text-muted-foreground">Find and book your next fitness class.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search classes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select onValueChange={setSelectedDate} value={selectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All dates</SelectItem>
                {[...new Set(classes.map((cls) => cls.date))].map((date) => (
                  <SelectItem key={date} value={date}>
                    {new Date(date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedType} value={selectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Class type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {[...new Set(classes.map((cls) => cls.type))].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
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

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {filteredClasses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No classes found matching your criteria.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedDate("")
                      setSelectedType("")
                      setSelectedTrainer("")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredClasses.map((cls) => (
                <Card key={cls.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              cls.type === "hiit"
                                ? "bg-red-500"
                                : cls.type === "yoga"
                                  ? "bg-blue-500"
                                  : cls.type === "strength"
                                    ? "bg-purple-500"
                                    : cls.type === "pilates"
                                      ? "bg-pink-500"
                                      : cls.type === "cardio"
                                        ? "bg-orange-500"
                                        : "bg-green-500"
                            }
                          >
                            {cls.type.charAt(0).toUpperCase() + cls.type.slice(1)}
                          </Badge>
                          <h3 className="text-lg font-bold">{cls.title}</h3>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(cls.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {cls.startTime} - {cls.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{cls.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{cls.trainer}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="font-medium">
                            {cls.booked}/{cls.capacity}
                          </span>{" "}
                          booked
                        </div>
                        <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => handleBookClass(cls.id)}>
                          Book Class
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="grid" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClasses.length === 0 ? (
                <div className="col-span-full">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <p className="text-center text-muted-foreground">No classes found matching your criteria.</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("")
                          setSelectedDate("")
                          setSelectedType("")
                          setSelectedTrainer("")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                filteredClasses.map((cls) => (
                  <Card key={cls.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge
                          className={
                            cls.type === "hiit"
                              ? "bg-red-500"
                              : cls.type === "yoga"
                                ? "bg-blue-500"
                                : cls.type === "strength"
                                  ? "bg-purple-500"
                                  : cls.type === "pilates"
                                    ? "bg-pink-500"
                                    : cls.type === "cardio"
                                      ? "bg-orange-500"
                                      : "bg-green-500"
                          }
                        >
                          {cls.type.charAt(0).toUpperCase() + cls.type.slice(1)}
                        </Badge>
                        <div className="text-sm">
                          <span className="font-medium">
                            {cls.booked}/{cls.capacity}
                          </span>{" "}
                          booked
                        </div>
                      </div>
                      <CardTitle className="mt-2">{cls.title}</CardTitle>
                      <CardDescription>{cls.trainer}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(cls.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {cls.startTime} - {cls.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{cls.location}</span>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-6">
                      <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => handleBookClass(cls.id)}>
                        Book Class
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
