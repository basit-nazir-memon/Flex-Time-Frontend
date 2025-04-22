"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, FileText, Upload } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "Jane",
    lastName: "User",
    email: "jane@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    address: "123 Main St, Anytown, USA",
    emergencyContact: "John Doe (Spouse) - +1 (555) 987-6543",
    bio: "Fitness enthusiast looking to improve my strength and flexibility. I enjoy HIIT workouts and yoga classes.",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    // In a real app, you would save the data to the backend here
  }

  return (
    <AppLayout userRole="user" userName="Jane User">
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">View and manage your personal information.</p>
          </div>
          {!isEditing && (
            <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Edit Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg" alt="Jane User" />
                        <AvatarFallback>JU</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Change Photo
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us a bit about yourself..."
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg" alt="Jane User" />
                        <AvatarFallback>JU</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {formData.firstName} {formData.lastName}
                        </h3>
                        <p className="text-muted-foreground">Member since January 2023</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p>{formData.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Date of Birth</p>
                          <p>{new Date(formData.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p>{formData.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Emergency Contact</p>
                          <p>{formData.emergencyContact}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Bio</p>
                      <p>{formData.bio}</p>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="membership" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Membership Information</CardTitle>
                <CardDescription>Your current membership details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Premium Package</h3>
                    <p className="text-muted-foreground">20-hour package</p>
                  </div>
                  <Badge className="bg-teal-600">Active</Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">12 hours remaining</p>
                      <p className="text-sm text-muted-foreground">60% of your package remaining</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Valid until</p>
                      <p className="text-sm text-muted-foreground">December 15, 2023</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Purchase History</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p>Premium Package (20 Hours)</p>
                        <p className="text-sm text-muted-foreground">June 15, 2023</p>
                      </div>
                      <p className="font-medium">$600.00</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p>Standard Package (10 Hours)</p>
                        <p className="text-sm text-muted-foreground">January 10, 2023</p>
                      </div>
                      <p className="font-medium">$350.00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-teal-600 hover:bg-teal-700">Buy More Hours</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Your uploaded documents and certificates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Insurance Certificate</p>
                      <p className="text-sm text-muted-foreground">Uploaded on: Jan 15, 2023</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Valid</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Medical Clearance</p>
                      <p className="text-sm text-muted-foreground">Uploaded on: Feb 10, 2023</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500">Valid</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Document
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
