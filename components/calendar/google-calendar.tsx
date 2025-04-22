"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, MapPin, User, Loader2 } from "lucide-react";
import { useThemeContext } from "@/contexts/theme-context";
import { formatDate, formatTime, getTranslation } from "@/utils/format-utils";
import { toast } from "sonner";

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  trainer: string;
}

type Props = {
  userRole: "admin" | "trainer" | "user";
};

export default function GoogleCalendar({ userRole }: Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, language, timeFormat, dateFormat, calendarView } =
    useThemeContext();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to view your calendar");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/bookings/upcoming`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch calendar events");
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        toast.error("Failed to load calendar events", {
          description:
            error instanceof Error ? error.message : "Please try again later",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleConnect = () => {
    window.open("https://calendar.google.com", "_blank");
  };

  const handleSync = () => {
    // In a real app, you would handle syncing with Google Calendar here
    alert("Calendar synced successfully!");
  };

  // Get translated role description
  const getRoleDescription = () => {
    if (userRole === "admin") {
      return getTranslation(
        "View and manage all classes and bookings",
        language
      );
    } else if (userRole === "trainer") {
      return getTranslation("View and manage your class schedule", language);
    } else {
      return getTranslation("View your booked classes", language);
    }
  };

  return (
    <Card className={theme === "dark" ? "bg-gray-800 text-white" : ""}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>{getTranslation("calendar", language)}</CardTitle>
            <CardDescription
              className={theme === "dark" ? "text-gray-300" : ""}
            >
              {getRoleDescription()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleConnect}>
              {getTranslation("View Google Calendar", language)}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
         
          <div className="pt-4">
            <h3 className="font-medium mb-2">
              {getTranslation("Upcoming Events", language)}
            </h3>
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : events.length > 0 ? (
                events.map((event) => (
                  <div
                    key={event.id}
                    className={`border rounded-md p-3 ${
                      theme === "dark" ? "border-gray-700" : ""
                    }`}
                  >
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(event.date, dateFormat, language)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(event.startTime, timeFormat, language)} -{" "}
                          {formatTime(event.endTime, timeFormat, language)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{event.trainer}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming events
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
