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
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"

export default function CreateClassPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    type: "",
    startTime: "",
    endTime: "",
    location: "",
    maxCapacity: "",
    description: "",
    requirements: "",
    isRecurringClass: false,
    frequency: "weekly",
    endDate: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("") // Clear error when user types
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Get token from localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          date: formData.date,
          type: formData.type,
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location,
          maxCapacity: parseInt(formData.maxCapacity),
          description: formData.description,
          requirements: formData.requirements,
          isRecurringClass: formData.isRecurringClass,
          frequency: formData.isRecurringClass ? formData.frequency : undefined,
          endDate: formData.isRecurringClass ? formData.endDate : undefined
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create class')
      }

      setSuccess(true)

      // Redirect to classes page after 2 seconds
      setTimeout(() => {
        router.push("/trainer/classes")
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the class')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppLayout userRole="trainer" userName="John Trainer">
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Class</h1>
          <p className="text-muted-foreground">Fill in the details to create a new fitness class.</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Class Details</CardTitle>
              <CardDescription>Enter the information about your new class.</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {success ? (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Class created successfully! Redirecting to classes page...
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Class Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., HIIT Workout"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input 
                        id="date" 
                        name="date" 
                        type="date" 
                        value={formData.date}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Class Type</Label>
                      <Select 
                        onValueChange={(value) => handleSelectChange("type", value)}
                        value={formData.type}
                        disabled={isSubmitting}
                      >
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxCapacity">Maximum Capacity</Label>
                      <Input
                        id="maxCapacity"
                        name="maxCapacity"
                        type="number"
                        min="1"
                        placeholder="e.g., 15"
                        value={formData.maxCapacity}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox
                        id="isRecurringClass"
                        checked={formData.isRecurringClass}
                        onCheckedChange={(checked) => handleCheckboxChange("isRecurringClass", checked === true)}
                        disabled={isSubmitting}
                      />
                      <Label htmlFor="isRecurringClass">This is a recurring class</Label>
                    </div>

                    {formData.isRecurringClass && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                        <div className="space-y-2">
                          <Label htmlFor="frequency">Frequency</Label>
                          <Select
                            onValueChange={(value) => handleSelectChange("frequency", value)}
                            value={formData.frequency}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Bi-weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">End Date</Label>
                          <Input
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <Alert className="bg-red-50 text-red-800 border-red-200">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </CardContent>

            <CardFooter className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Class"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
