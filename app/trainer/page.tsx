"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Dumbbell, Clock, Loader2 } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface UpcomingClass {
  classTitle: string
  classDay: string
  time: string
  location: string
  totalCapacity: number
  bookedCapacity: number
}

interface RecentStudent {
  avatar: string
  name: string
  classBookedIn: string
  classBooked: string
}

interface DashboardData {
  todaysClasses: number
  nextClassIn: string
  totalStudents: number
  lastWeekStudentChange: string
  hoursTaughtThisMonth: number
  upcomingClassesInNext7Days: UpcomingClass[]
  recentStudents: RecentStudent[]
}

export default function TrainerDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/trainer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        toast.error("Failed to load dashboard data", {
          description: error instanceof Error ? error.message : "Please try again later"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  if (isLoading) {
    return (
      <AppLayout userRole="trainer" userName="Loading...">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trainer Dashboard</h1>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!dashboardData) {
    return (
      <AppLayout userRole="trainer" userName="Trainer">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trainer Dashboard</h1>
            <p className="text-muted-foreground">Failed to load dashboard data</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout userRole="trainer" userName="Trainer">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your classes.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.todaysClasses}</div>
              <p className="text-xs text-muted-foreground">Next class in {dashboardData.nextClassIn}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalStudents}</div>
              <p className="text-xs text-muted-foreground">{dashboardData.lastWeekStudentChange} from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Taught</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.hoursTaughtThisMonth}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
            <TabsTrigger value="students">Recent Students</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>Your scheduled classes for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.upcomingClassesInNext7Days.map((class_, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{class_.classTitle}</p>
                        <p className="text-sm text-muted-foreground">{class_.classDay}, {class_.time}</p>
                        <p className="text-sm text-muted-foreground">{class_.location}</p>
                      </div>
                      <div className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded">
                        {class_.bookedCapacity} / {class_.totalCapacity} booked
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Students</CardTitle>
                <CardDescription>Students who attended your recent classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentStudents.map((student, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <img 
                            src={student.avatar} 
                            alt={student.name}
                            className="h-full w-full rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.classBookedIn}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.classBooked}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
