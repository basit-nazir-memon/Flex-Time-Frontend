"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2 } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  joinDate: string
  hoursRemaining: number
  totalPackages: number
  blocked: boolean
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("active")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      toast.error("Failed to load users", {
        description: error instanceof Error ? error.message : "Please try again later"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlockUser = async (userId: string, blocked: boolean) => {
    try {
      setUpdatingUser(userId)
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/block/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, blocked }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user status")
      }

      // Update the local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, blocked } : user
      ))

      toast.success(`User ${blocked ? "blocked" : "unblocked"} successfully`)
    } catch (error) {
      toast.error("Failed to update user status", {
        description: error instanceof Error ? error.message : "Please try again later"
      })
    } finally {
      setUpdatingUser(null)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = user.blocked !== (activeTab === "active")

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <AppLayout userRole="admin" userName="Admin User">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">Loading users...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">Manage all users of the platform.</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users by name or email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active Users</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Users</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No active users found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Active Users</CardTitle>
                  <CardDescription>Users with active accounts and packages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Joined: {new Date(user.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">{user.hoursRemaining}</span>
                            <span className="text-xs text-muted-foreground">Hours Left</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">{user.totalPackages}</span>
                            <span className="text-xs text-muted-foreground">Packages</span>
                          </div>
                          <Badge
                            variant={user.blocked ? "secondary" : "default"}
                            className={user.blocked ? "bg-red-500" : ""}
                          >
                            {user.blocked ? "Blocked" : "Active"}
                          </Badge>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleBlockUser(user.id, !user.blocked)}
                              disabled={updatingUser === user.id}
                            >
                              {updatingUser === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : user.blocked ? (
                                "Unblock"
                              ) : (
                                "Block"
                              )}
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

          <TabsContent value="inactive" className="space-y-4">
            {filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-center text-muted-foreground">No inactive users found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Inactive Users</CardTitle>
                  <CardDescription>Users with expired packages or inactive accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Joined: {new Date(user.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">{user.hoursRemaining}</span>
                            <span className="text-xs text-muted-foreground">Hours Left</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-medium">{user.totalPackages}</span>
                            <span className="text-xs text-muted-foreground">Packages</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-teal-600 text-white hover:bg-teal-700"
                              onClick={() => handleBlockUser(user.id, !user.blocked)}
                              disabled={updatingUser === user.id}
                            >
                              {updatingUser === user.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Unblock"
                              )}
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
