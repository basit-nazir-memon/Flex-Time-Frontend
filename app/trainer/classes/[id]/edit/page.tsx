"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AppLayout from "@/components/layout/app-layout"

// Sample class data (in a real app, this would be fetched based on the ID)
const classData = {
  id: 1,
  title: "HIIT Workout",
  date: "2023-06-15",
  startTime: "10:00",
  endTime: "11:00",
  location: "Studio 1",
  capacity: "15",
  type: "hiit",
  description:
    "High-Intensity Interval Training (HIIT) combines short periods of intense exercise with less intense recovery periods. This class is designed to get your heart rate up and burn fat in less time. Suitable for all fitness levels with modifications provided.",
  requirements: "Comfortable workout clothes, water bottle, towel. Bring your own mat if preferred.",
}

export default function EditClassPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState(classData)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      router.push(`/trainer/classes/${params.id}`)
    }, 1500)
  }

  return (
    <AppLayout userRole="trainer" userName="John Trainer">
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Class</h1>
          <p className="text-muted-foreground">Update your class details.</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Class Details</CardTitle>
              <CardDescription>Update the information about your class.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Class Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., HIIT Workout"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Class Type</Label>
                  <Select defaultValue={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hiit">HIIT</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                      <SelectItem value="pilates">Pilates</SelectItem>
                      <SelectItem value="strength">Strength Training</SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="dance">Dance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g., Studio 3"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Maximum Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    placeholder="e.g., 15"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Class Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what participants can expect in this class..."
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  placeholder="What should participants bring or know before attending..."
                  rows={3}
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSaving}>
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
