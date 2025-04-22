"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: string
  defaultColorTheme?: string
  defaultTextSize?: string
}

type ThemeContextType = {
  theme: string
  setTheme: (theme: string) => void
  colorTheme: string
  setColorTheme: (colorTheme: string) => void
  textSize: string
  setTextSize: (textSize: string) => void
  // Add preferences
  language: string
  setLanguage: (language: string) => void
  timeFormat: string
  setTimeFormat: (timeFormat: string) => void
  dateFormat: string
  setDateFormat: (dateFormat: string) => void
  calendarView: string
  setCalendarView: (calendarView: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultColorTheme = "teal",
  defaultTextSize = "medium",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState(defaultTheme)
  const [colorTheme, setColorTheme] = useState(defaultColorTheme)
  const [textSize, setTextSize] = useState(defaultTextSize)
  const [mounted, setMounted] = useState(false)

  // Add preferences state
  const [language, setLanguage] = useState("english")
  const [timeFormat, setTimeFormat] = useState("12h")
  const [dateFormat, setDateFormat] = useState("mdy")
  const [calendarView, setCalendarView] = useState("week")

  // After mounting, we have access to localStorage
  useEffect(() => {
    setMounted(true)

    // Load saved preferences from localStorage
    const savedTheme = localStorage.getItem("theme") || defaultTheme
    const savedColorTheme = localStorage.getItem("colorTheme") || defaultColorTheme
    const savedTextSize = localStorage.getItem("textSize") || defaultTextSize

    // Load additional preferences
    const savedLanguage = localStorage.getItem("language") || "english"
    const savedTimeFormat = localStorage.getItem("timeFormat") || "12h"
    const savedDateFormat = localStorage.getItem("dateFormat") || "mdy"
    const savedCalendarView = localStorage.getItem("calendarView") || "week"

    setTheme(savedTheme)
    setColorTheme(savedColorTheme)
    setTextSize(savedTextSize)
    setLanguage(savedLanguage)
    setTimeFormat(savedTimeFormat)
    setDateFormat(savedDateFormat)
    setCalendarView(savedCalendarView)

    // Apply the saved preferences
    document.documentElement.classList.toggle("dark", savedTheme === "dark")

    // Remove existing theme classes
    document.documentElement.classList.forEach((cls) => {
      if (cls.startsWith("theme-")) {
        document.documentElement.classList.remove(cls)
      }
    })

    // Add color theme class
    document.documentElement.classList.add(`theme-${savedColorTheme}`)

    // Remove existing text size classes
    document.documentElement.classList.forEach((cls) => {
      if (cls.startsWith("text-size-")) {
        document.documentElement.classList.remove(cls)
      }
    })

    // Add text size class
    document.documentElement.classList.add(`text-size-${savedTextSize}`)

    // Add language class if needed
    document.documentElement.lang = savedLanguage

    // Add data attributes for other preferences
    document.documentElement.setAttribute("data-time-format", savedTimeFormat)
    document.documentElement.setAttribute("data-date-format", savedDateFormat)
    document.documentElement.setAttribute("data-calendar-view", savedCalendarView)
  }, [defaultTheme, defaultColorTheme, defaultTextSize])

  // Update localStorage and apply changes when theme preferences change
  useEffect(() => {
    if (!mounted) return

    localStorage.setItem("theme", theme)
    localStorage.setItem("colorTheme", colorTheme)
    localStorage.setItem("textSize", textSize)
    localStorage.setItem("language", language)
    localStorage.setItem("timeFormat", timeFormat)
    localStorage.setItem("dateFormat", dateFormat)
    localStorage.setItem("calendarView", calendarView)

    document.documentElement.classList.toggle("dark", theme === "dark")

    // Update color theme
    document.documentElement.classList.forEach((cls) => {
      if (cls.startsWith("theme-")) {
        document.documentElement.classList.remove(cls)
      }
    })
    document.documentElement.classList.add(`theme-${colorTheme}`)

    // Update text size
    document.documentElement.classList.forEach((cls) => {
      if (cls.startsWith("text-size-")) {
        document.documentElement.classList.remove(cls)
      }
    })
    document.documentElement.classList.add(`text-size-${textSize}`)

    // Update language
    document.documentElement.lang = language

    // Update other preferences
    document.documentElement.setAttribute("data-time-format", timeFormat)
    document.documentElement.setAttribute("data-date-format", dateFormat)
    document.documentElement.setAttribute("data-calendar-view", calendarView)
  }, [theme, colorTheme, textSize, language, timeFormat, dateFormat, calendarView, mounted])

  const value = {
    theme,
    setTheme,
    colorTheme,
    setColorTheme,
    textSize,
    setTextSize,
    language,
    setLanguage,
    timeFormat,
    setTimeFormat,
    dateFormat,
    setDateFormat,
    calendarView,
    setCalendarView,
  }

  return (
    <ThemeContext.Provider value={value}>
      <NextThemesProvider attribute="class" defaultTheme={theme} enableSystem={false}>
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}
