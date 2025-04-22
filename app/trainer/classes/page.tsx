"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Search, Edit, Plus, MoreHorizontal, Users } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"

export default function TrainerClassesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/classes/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch classes")
        }

        const data = await response.json()
        setClasses(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClasses()
  }, [router])

  const filteredClasses = classes.filter((cls: any) => {
    const matchesSearch =
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || !selectedType ? true : cls.type === selectedType
    const matchesStatus = cls.status === activeTab

    return matchesSearch && matchesType && matchesStatus
  })

  const handleCreateClass = () => {
    router.push("/trainer/classes/create")
  }

  const handleEditClass = (id: number) => {
    router.push(`/trainer/classes/${id}/edit`)
  }

  const handleViewClass = (id: number) => {
    router.push(`/trainer/classes/${id}`)
  }

  return (
    <AppLayout userRole="trainer" userName="John Trainer">
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
            <p className="text-muted-foreground">Manage your fitness classes.</p>
          </div>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCreateClass}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Class
          </Button>
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

          <div>
            <Select onValueChange={setSelectedType} value={selectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
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
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
            <TabsTrigger value="completed">Past Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {filteredClasses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No upcoming classes found.</p>
                  <Button className="mt-4 bg-teal-600 hover:bg-teal-700" onClick={handleCreateClass}>
                    Create Your First Class
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredClasses.map((cls: any) => (
                <Card key={cls.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div
                        className={`w-2 md:w-2 h-full md:h-auto ${
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
                                    : cls.type === "boxing"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                        }`}
                      />
                      <div className="flex-1 p-6">
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
                                            : cls.type === "boxing"
                                              ? "bg-yellow-500"
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
                                <Users className="h-4 w-4" />
                                <span>
                                  {cls.booked}/{cls.capacity} booked
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewClass(cls.id)}>
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center"
                              onClick={() => handleEditClass(cls.id)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredClasses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No past classes found.</p>
                </CardContent>
              </Card>
            ) : (
              filteredClasses.map((cls: any) => (
                <Card key={cls.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div
                        className={`w-2 md:w-2 h-full md:h-auto ${
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
                                    : cls.type === "boxing"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                        }`}
                      />
                      <div className="flex-1 p-6">
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
                                            : cls.type === "boxing"
                                              ? "bg-yellow-500"
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
                                <Users className="h-4 w-4" />
                                <span>
                                  {cls.booked}/{cls.capacity} attended
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewClass(cls.id)}>
                              View Details
                            </Button>
                          </div> */}
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
