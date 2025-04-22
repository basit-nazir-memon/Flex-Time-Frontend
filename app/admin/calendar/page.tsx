import AppLayout from "@/components/layout/app-layout"
import GoogleCalendar from "@/components/calendar/google-calendar"

export default function AdminCalendarPage() {
  return (
    <AppLayout userRole="admin" userName="Admin User">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View and manage all classes and bookings.</p>
        </div>

        <GoogleCalendar userRole="admin" />
      </div>
    </AppLayout>
  )
}
