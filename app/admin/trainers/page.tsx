"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MoreHorizontal, Loader2 } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Trainer {
  id: string
  name: string
  email: string
  specialties: string[]
  classes: number
  active: boolean
}

export default function TrainersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trainers/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch trainers")
        }

        const data = await response.json()
        setTrainers(data)
      } catch (error) {
        toast.error("Failed to load trainers", {
          description: error instanceof Error ? error.message : "Please try again later"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrainers()
  }, [router])

  const filteredTrainers = trainers.filter(
    (trainer) =>
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <AppLayout userRole="admin" userName="Admin User">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trainers</h1>
            <p className="text-muted-foreground">Manage your fitness trainers.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search trainers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Trainers</CardTitle>
            <CardDescription>A list of all trainers in your fitness studio.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTrainers.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No trainers found.</p>
            ) : (
              <div className="space-y-4">
                {filteredTrainers.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{trainer.name}</p>
                        <p className="text-sm text-muted-foreground">{trainer.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                      {trainer.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="font-medium">{trainer.classes}</span> classes
                      </div>
                      <Badge
                        variant={trainer.active ? "default" : "secondary"}
                        className={trainer.active ? "bg-green-500" : ""}
                      >
                        {trainer.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}

