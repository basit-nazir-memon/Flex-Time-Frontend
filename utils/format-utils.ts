import { format } from "date-fns"
import { es, fr, de, enUS, type Locale } from "date-fns/locale"

// Map of language codes to date-fns locales
const locales: Record<string, Locale> = {
  english: enUS,
  spanish: es,
  french: fr,
  german: de,
}

// Format a date according to user preferences
export function formatDate(date: Date | string, dateFormat: string, language: string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const locale = locales[language] || enUS

  switch (dateFormat) {
    case "mdy":
      return format(dateObj, "MM/dd/yyyy", { locale })
    case "dmy":
      return format(dateObj, "dd/MM/yyyy", { locale })
    case "ymd":
      return format(dateObj, "yyyy/MM/dd", { locale })
    default:
      return format(dateObj, "MM/dd/yyyy", { locale })
  }
}

// Format a time according to user preferences
export function formatTime(time: string | Date, timeFormat: string, language: string): string {
  let timeObj: Date

  if (typeof time === "string" && time.includes(":")) {
    // Parse time string like "10:00" into a Date object
    const [hours, minutes] = time.split(":").map(Number)
    timeObj = new Date()
    timeObj.setHours(hours, minutes, 0)
  } else {
    timeObj = typeof time === "string" ? new Date(time) : time
  }

  const locale = locales[language] || enUS

  return timeFormat === "12h" ? format(timeObj, "h:mm a", { locale }) : format(timeObj, "HH:mm", { locale })
}

// Get translations for common UI elements
export function getTranslation(key: string, language: string): string {
  const translations: Record<string, Record<string, string>> = {
    english: {
      dashboard: "Dashboard",
      classes: "Classes",
      bookings: "Bookings",
      calendar: "Calendar",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      book_class: "Book Class",
      view_details: "View Details",
      confirm: "Confirm",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
    },
    spanish: {
      dashboard: "Panel",
      classes: "Clases",
      bookings: "Reservas",
      calendar: "Calendario",
      profile: "Perfil",
      settings: "Ajustes",
      logout: "Cerrar sesión",
      book_class: "Reservar Clase",
      view_details: "Ver Detalles",
      confirm: "Confirmar",
      cancel: "Cancelar",
      save: "Guardar",
      edit: "Editar",
      delete: "Eliminar",
    },
    french: {
      dashboard: "Tableau de bord",
      classes: "Cours",
      bookings: "Réservations",
      calendar: "Calendrier",
      profile: "Profil",
      settings: "Paramètres",
      logout: "Déconnexion",
      book_class: "Réserver un cours",
      view_details: "Voir les détails",
      confirm: "Confirmer",
      cancel: "Annuler",
      save: "Enregistrer",
      edit: "Modifier",
      delete: "Supprimer",
    },
    german: {
      dashboard: "Dashboard",
      classes: "Kurse",
      bookings: "Buchungen",
      calendar: "Kalender",
      profile: "Profil",
      settings: "Einstellungen",
      logout: "Abmelden",
      book_class: "Kurs buchen",
      view_details: "Details anzeigen",
      confirm: "Bestätigen",
      cancel: "Abbrechen",
      save: "Speichern",
      edit: "Bearbeiten",
      delete: "Löschen",
    },
  }

  return translations[language]?.[key] || translations["english"][key] || key
}
