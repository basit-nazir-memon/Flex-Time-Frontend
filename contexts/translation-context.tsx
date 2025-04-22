"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { useThemeContext } from "./theme-context"

type TranslationContextType = {
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const { language } = useThemeContext()

  // Translations for different languages
  const translations: Record<string, Record<string, string>> = {
    english: {
      // Navigation
      Dashboard: "Dashboard",
      Classes: "Classes",
      Bookings: "Bookings",
      Calendar: "Calendar",
      Profile: "Profile",
      Settings: "Settings",
      Logout: "Logout",

      // Common actions
      "Book Class": "Book Class",
      "View Details": "View Details",
      Edit: "Edit",
      Delete: "Delete",
      Save: "Save",
      Cancel: "Cancel",
      Confirm: "Confirm",

      // Days of week
      Sun: "Sun",
      Mon: "Mon",
      Tue: "Tue",
      Wed: "Wed",
      Thu: "Thu",
      Fri: "Fri",
      Sat: "Sat",

      // Calendar
      "Upcoming Events": "Upcoming Events",
      "Monthly Overview": "Monthly Overview",
      "Today's Schedule": "Today's Schedule",
      "Connect Google Calendar": "Connect Google Calendar",
      "Sync with Google Calendar": "Sync with Google Calendar",
      "View and manage all classes and bookings": "View and manage all classes and bookings",
      "View and manage your class schedule": "View and manage your class schedule",
      "View your booked classes": "View your booked classes",
    },
    spanish: {
      // Navigation
      Dashboard: "Panel",
      Classes: "Clases",
      Bookings: "Reservas",
      Calendar: "Calendario",
      Profile: "Perfil",
      Settings: "Ajustes",
      Logout: "Cerrar sesión",

      // Common actions
      "Book Class": "Reservar Clase",
      "View Details": "Ver Detalles",
      Edit: "Editar",
      Delete: "Eliminar",
      Save: "Guardar",
      Cancel: "Cancelar",
      Confirm: "Confirmar",

      // Days of week
      Sun: "Dom",
      Mon: "Lun",
      Tue: "Mar",
      Wed: "Mié",
      Thu: "Jue",
      Fri: "Vie",
      Sat: "Sáb",

      // Calendar
      "Upcoming Events": "Próximos Eventos",
      "Monthly Overview": "Resumen Mensual",
      "Today's Schedule": "Horario de Hoy",
      "Connect Google Calendar": "Conectar con Google Calendar",
      "Sync with Google Calendar": "Sincronizar con Google Calendar",
      "View and manage all classes and bookings": "Ver y gestionar todas las clases y reservas",
      "View and manage your class schedule": "Ver y gestionar tu horario de clases",
      "View your booked classes": "Ver tus clases reservadas",
    },
    french: {
      // Navigation
      Dashboard: "Tableau de bord",
      Classes: "Cours",
      Bookings: "Réservations",
      Calendar: "Calendrier",
      Profile: "Profil",
      Settings: "Paramètres",
      Logout: "Déconnexion",

      // Common actions
      "Book Class": "Réserver un cours",
      "View Details": "Voir les détails",
      Edit: "Modifier",
      Delete: "Supprimer",
      Save: "Enregistrer",
      Cancel: "Annuler",
      Confirm: "Confirmer",

      // Days of week
      Sun: "Dim",
      Mon: "Lun",
      Tue: "Mar",
      Wed: "Mer",
      Thu: "Jeu",
      Fri: "Ven",
      Sat: "Sam",

      // Calendar
      "Upcoming Events": "Événements à venir",
      "Monthly Overview": "Aperçu mensuel",
      "Today's Schedule": "Programme d'aujourd'hui",
      "Connect Google Calendar": "Connecter Google Calendar",
      "Sync with Google Calendar": "Synchroniser avec Google Calendar",
      "View and manage all classes and bookings": "Voir et gérer tous les cours et réservations",
      "View and manage your class schedule": "Voir et gérer votre emploi du temps",
      "View your booked classes": "Voir vos cours réservés",
    },
    german: {
      // Navigation
      Dashboard: "Dashboard",
      Classes: "Kurse",
      Bookings: "Buchungen",
      Calendar: "Kalender",
      Profile: "Profil",
      Settings: "Einstellungen",
      Logout: "Abmelden",

      // Common actions
      "Book Class": "Kurs buchen",
      "View Details": "Details anzeigen",
      Edit: "Bearbeiten",
      Delete: "Löschen",
      Save: "Speichern",
      Cancel: "Abbrechen",
      Confirm: "Bestätigen",

      // Days of week
      Sun: "So",
      Mon: "Mo",
      Tue: "Di",
      Wed: "Mi",
      Thu: "Do",
      Fri: "Fr",
      Sat: "Sa",

      // Calendar
      "Upcoming Events": "Kommende Ereignisse",
      "Monthly Overview": "Monatsübersicht",
      "Today's Schedule": "Heutiger Zeitplan",
      "Connect Google Calendar": "Google Kalender verbinden",
      "Sync with Google Calendar": "Mit Google Kalender synchronisieren",
      "View and manage all classes and bookings": "Alle Kurse und Buchungen anzeigen und verwalten",
      "View and manage your class schedule": "Ihren Kursplan anzeigen und verwalten",
      "View your booked classes": "Ihre gebuchten Kurse anzeigen",
    },
  }

  // Translation function
  const t = (key: string): string => {
    return translations[language]?.[key] || translations.english[key] || key
  }

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return <TranslationContext.Provider value={{ t }}>{children}</TranslationContext.Provider>
}

export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}
