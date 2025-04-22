"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, Dumbbell, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import AppLayout from "@/components/layout/app-layout"
import { toast } from "sonner"

interface NextClass {
  title: string
  day: string
  time: string
  trainer: string
  location: string
}

interface UpcomingClass {
  title: string
  trainer: string
  timeLeft: string
  time: string
  classDuration: string
}

interface DashboardData {
  remainingTime: string
  percentageRemaining: number
  timeTagLine: string
  nextClass: NextClass
  upcomingClasses: UpcomingClass[]
}

export default function UserDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = mounted ? localStorage.getItem("token") : null
        if (!token) {
          toast.error("Please login to view your dashboard")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }

        const data = await response.json()
        setDashboardData(data)
        // console.log(data)
      } catch (error) {
        toast.error("Failed to load dashboard data", {
          description: error instanceof Error ? error.message : "Please try again later"
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (typeof window !== "undefined") {
      fetchDashboardData()
    }
  }, [])

  if (isLoading) {
    return (
      <AppLayout userRole="user" userName="Jane User">
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    )
  }

  if (!dashboardData) {
    return (
      <AppLayout userRole="user" userName="Jane User">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
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
          <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Jane. Here's your fitness overview.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-2xl font-bold">{dashboardData.remainingTime}</div>
              <Progress value={dashboardData.percentageRemaining} className="h-2" />
              <p className="text-xs text-muted-foreground">{dashboardData.timeTagLine}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/user/packages">Buy More Hours</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Class</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{dashboardData.nextClass?.title || "No next class"}</p>
                    <p className="text-sm text-muted-foreground">Trainer: {dashboardData.nextClass?.trainer || "No trainer"}</p>
                    <p className="text-sm text-muted-foreground">
                      {dashboardData.nextClass?.day}, {dashboardData.nextClass?.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{dashboardData.nextClass?.location || "No location"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/user/classes">View All Classes</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Classes you've booked for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.upcomingClasses.map((class_, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">{class_.title}</p>
                    <p className="text-sm text-muted-foreground">Trainer: {class_.trainer}</p>
                    <p className="text-sm text-muted-foreground">
                      {class_.timeLeft}, {class_.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{class_.classDuration}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/user/classes">
                Browse More Classes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  )
}
