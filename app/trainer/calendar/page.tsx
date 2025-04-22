import AppLayout from "@/components/layout/app-layout"
import GoogleCalendar from "@/components/calendar/google-calendar"

export default function TrainerCalendarPage() {
  return (
    <AppLayout userRole="trainer" userName="John Trainer">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">View and manage your class schedule.</p>
        </div>

        <GoogleCalendar userRole="trainer" />
      </div>
    </AppLayout>
  )
}
