import AppLayout from "@/components/layout/app-layout"
import GoogleCalendar from "@/components/calendar/google-calendar"

export default function UserCalendarPage() {
  return (
    <AppLayout userRole="user" userName="Jane User">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View your booked classes and sync with your Google Calendar.</p>
        </div>

        <GoogleCalendar userRole="user" />
      </div>
    </AppLayout>
  )
}
