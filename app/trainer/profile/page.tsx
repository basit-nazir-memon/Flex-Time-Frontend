"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Upload, Star, Clock, Loader2 } from "lucide-react"
import AppLayout from "@/components/layout/app-layout"
import { toast } from "sonner"

export default function TrainerProfilePage() {
  const router = useRouter()
  // const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any>(null)
  const [isUploadingDocument, setIsUploadingDocument] = useState(false)
  const documentInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialties: [] as string[],
    bio: "",
    experience: "",
    certifications: "",
    availability: "",
    avatar: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchProfile()
    }
  }, [router])

  const fetchProfile = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trainers/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfileData(data)
      setFormData({
        firstName: data.fullName.split(" ")[0],
        lastName: data.fullName.split(" ").slice(1).join(" "),
        email: data.email,
        phone: data.phone || "",
        specialties: data.specialties || [],
        bio: data.bio || "",
        experience: data.experience || "",
        certifications: data.certifications || "",
        availability: data.availability || "",
        avatar: data.avatar || "",
      })
    } catch (err: any) {
      setError(err.message)
      toast.error("Error", {
        description: "Failed to load profile data",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    fileInputRef.current?.click()
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
      if (!token) {
        router.push("/login")
        return
      }

      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, avatar: data.image_url }))
      toast("Success", {
        description: "Profile photo updated successfully",
      })
    } catch (err) {
      toast("Error", {
        description: "Failed to upload profile photo",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trainers/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          avatar: formData.avatar,
          bio: formData.bio,
          specialties: formData.specialties,
          experience: formData.experience,
          certifications: formData.certifications,
          availability: formData.availability,
        }),
      })

      if (!response.ok) {
        throw new Error( response?.error || "Failed to update profile")
      }

      setIsEditing(false)
      await fetchProfile() // Refresh profile data
      toast("Success", {
        description: "Profile updated successfully",
      })
    } catch (err) {
      toast("Error", {
        description: "Failed to update profile",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error("Invalid file type", {
        description: "Please upload a PDF file"
      })
      return
    }

    setIsUploadingDocument(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
      if (!token) {
        router.push("/login")
        return
      }

      const formData = new FormData()
      formData.append("document", file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/trainers/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload document")
      }

      await fetchProfile()
      toast.success("Document uploaded successfully", {
        description: "Your document has been uploaded and is pending verification."
      })
    } catch (err) {
      toast.error("Failed to upload document", {
        description: "Please try again later."
      })
    } finally {
      setIsUploadingDocument(false)
      if (documentInputRef.current) {
        documentInputRef.current.value = ''
      }
    }
  }

  if (isLoading) {
    return (
      <AppLayout userRole="trainer" userName="Loading...">
        <div className="flex flex-col gap-6 pb-20 md:pb-0">
          <div>Loading profile...</div>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout userRole="trainer" userName="Error">
        <div className="flex flex-col gap-6 pb-20 md:pb-0">
          <div>Error loading profile: {error}</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout userRole="trainer" userName={profileData?.fullName || "Trainer"}>
      <div className="flex flex-col gap-6 pb-20 md:pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">View and manage your trainer profile.</p>
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
            <TabsTrigger value="professional">Professional Info</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
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
                        <AvatarImage src={formData.avatar} alt={formData.firstName} />
                        <AvatarFallback>{formData.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePhotoClick}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Change Photo
                            </>
                          )}
                        </Button>
                      </div>
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

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell clients about yourself..."
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
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
                        <AvatarImage src={profileData.avatar || "/placeholder.svg"} alt={profileData.fullName} />
                        <AvatarFallback>{profileData.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{profileData.fullName}</h3>
                        <p className="text-muted-foreground">Trainer</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>{profileData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p>{profileData.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Bio</p>
                      <p>{profileData.bio}</p>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="professional" className="space-y-4">
            <Card>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <CardTitle>Edit Professional Information</CardTitle>
                    <CardDescription>Update your professional details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialties">Specialties</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialties" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hiit">HIIT</SelectItem>
                          <SelectItem value="strength">Strength Training</SelectItem>
                          <SelectItem value="yoga">Yoga</SelectItem>
                          <SelectItem value="pilates">Pilates</SelectItem>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="boxing">Boxing</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                            <button
                              className="ml-1 text-xs"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  specialties: formData.specialties.filter((_, i) => i !== index),
                                })
                              }
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Input
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="e.g., 5+ years"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications</Label>
                      <Textarea
                        id="certifications"
                        name="certifications"
                        value={formData.certifications}
                        onChange={handleChange}
                        rows={3}
                        placeholder="List your certifications..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability</Label>
                      <Textarea
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Describe your availability..."
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
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Your professional details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-2">
                        {profileData.specialties.map((specialty: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Experience</p>
                        <p>{profileData.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Availability</p>
                        <p>{profileData.availability}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Certifications</p>
                      <p>{profileData.certifications}</p>
                    </div>

                    {/* <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">24 hours taught this month</p>
                        <p className="text-sm text-muted-foreground">42 total clients</p>
                      </div>
                    </div> */}
                  </CardContent>
                </>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Your uploaded documents and certificates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileData?.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">Uploaded on: {doc.uploadedOn}</p>
                      </div>
                    </div>
                    <Badge 
                      className={`bg-${doc.status === 'Valid' ? 'green' : 
                        doc.status === 'pending' ? 'yellow' : 'red'}-500`}
                    >
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </Badge>
                  </div>
                ))}

                {profileData?.documents.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No documents uploaded yet
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <input
                  type="file"
                  ref={documentInputRef}
                  accept=".pdf"
                  className="hidden"
                  onChange={handleDocumentUpload}
                />
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => documentInputRef.current?.click()}
                  disabled={isUploadingDocument}
                >
                  {isUploadingDocument ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Document
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Supported format: PDF. Maximum file size: 5MB
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
                <CardDescription>What your clients are saying about you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (profileData.overallRating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{profileData.overallRating || 0} out of 5</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Based on {profileData.totalReviews} reviews</span>
                </div>

                <div className="space-y-6">
                  {profileData.reviews.map((review: any, index: number) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">{review.name}</p>
                          <p className="text-sm text-muted-foreground">{review.date}</p>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p>{review.comment}</p>
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
