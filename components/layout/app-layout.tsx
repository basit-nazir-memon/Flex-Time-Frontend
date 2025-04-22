"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Home, Users, Dumbbell, BookOpen, Settings, LogOut, Menu, X, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useThemeContext } from "@/contexts/theme-context"
import { useTranslation } from "@/contexts/translation-context"

type NavItem = {
  title: string
  href: string
  icon: React.ElementType
  onClick?: () => void
}

type Props = {
  children: React.ReactNode
  userRole: "admin" | "trainer" | "user"
  userName?: string
}

export default function AppLayout({ children, userRole }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { theme } = useThemeContext()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [userName, setUserName] = useState('')
  const [userImage, setUserImage] = useState('')

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem('name') || '')
      setUserImage(localStorage.getItem('avatar') || '')
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      // Clear all authentication data
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
      localStorage.removeItem('name')
      localStorage.removeItem('avatar')

      // Clear cookies
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    }

    // Redirect to login page
    router.push('/auth/login')
  }

  // Define navigation items based on user role
  const getNavItems = (): NavItem[] => {
    switch (userRole) {
      case "admin":
        return [
          { title: t("Dashboard"), href: "/admin", icon: Home },
          { title: t("Trainers"), href: "/admin/trainers", icon: Users },
          { title: t("Users"), href: "/admin/users", icon: User },
          { title: t("Classes"), href: "/admin/classes", icon: Dumbbell },
          { title: t("Bookings"), href: "/admin/bookings", icon: BookOpen },
          { title: t("Calendar"), href: "/admin/calendar", icon: Calendar },
        ]
      case "trainer":
        return [
          { title: t("Dashboard"), href: "/trainer", icon: Home },
          { title: t("Classes"), href: "/trainer/classes", icon: Dumbbell },
          { title: t("Calendar"), href: "/trainer/calendar", icon: Calendar },
          { title: t("Profile"), href: "/trainer/profile", icon: User },
        ]
      case "user":
        return [
          { title: t("Dashboard"), href: "/user", icon: Home },
          { title: t("Classes"), href: "/user/classes", icon: Dumbbell },
          { title: t("Bookings"), href: "/user/bookings", icon: BookOpen },
          { title: t("Calendar"), href: "/user/calendar", icon: Calendar },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()
  const mainNavItems = navItems.slice(0, 4) // For mobile bottom nav
  const allNavItems = navItems // For sidebar

  // Secondary nav items (common for all roles)
  const secondaryNavItems: NavItem[] = [
    { title: t("Settings"), href: `/${userRole}/settings`, icon: Settings },
    { title: t("Logout"), href: "#", icon: LogOut, onClick: handleLogout },
  ]

  const renderSecondaryNavItem = (item: NavItem) => {
    if (item.onClick) {
      return (
        <button
          key={item.title}
          onClick={item.onClick}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:text-primary",
            "text-muted-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.title}
        </button>
      )
    }

    return (
      <Link
        key={item.title}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:text-primary",
          pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
        )}
      >
        <item.icon className="h-5 w-5" />
        {item.title}
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Mobile Header */}
      {isMobile && (
        <header className="h-16 border-b bg-white dark:bg-gray-800 flex items-center justify-between px-4 sticky top-0 z-10">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between py-4">
                  <Link href={`/${userRole}`} className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Dumbbell className="h-6 w-6" />
                    <span>Flex Time</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>

                <div className="flex items-center gap-4 py-4 px-2 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-muted-foreground capitalize">{t(userRole)}</p>
                  </div>
                </div>

                <nav className="flex-1 py-4">
                  <div className="px-2 py-2">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">{t("Main Navigation")}</h2>
                    <div className="space-y-1">
                      {allNavItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                            pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="px-2 py-2">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">{t("Settings")}</h2>
                    <div className="space-y-1">
                      {secondaryNavItems.map((item) => renderSecondaryNavItem(item))}
                    </div>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href={`/${userRole}`} className="flex items-center gap-2 font-bold text-xl text-primary">
            <Dumbbell className="h-6 w-6" />
            <span>Flex Time</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Avatar className="h-8 w-8">
              <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </header>
      )}

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-64 border-r bg-white dark:bg-gray-800 hidden md:block">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 font-bold text-xl text-primary p-4 border-b">
                <Dumbbell className="h-6 w-6" />
                <span>Flex Time</span>
              </div>

              <div className="flex items-center gap-4 p-4 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
                  <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userName}</p>
                  <p className="text-sm text-muted-foreground capitalize">{t(userRole)}</p>
                </div>
              </div>

              <nav className="flex-1 py-4">
                <div className="px-3 py-2">
                  <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{t("Main Navigation")}</h2>
                  <div className="space-y-1">
                    {allNavItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:text-primary",
                          pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="px-3 py-2">
                  <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{t("Settings")}</h2>
                  <div className="space-y-1">
                    {secondaryNavItems.map((item) => renderSecondaryNavItem(item))}
                  </div>
                </div>
              </nav>

              <div className="p-4 border-t flex justify-center">
                <ThemeSwitcher />
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4 md:px-6 max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-gray-800 flex justify-around items-center h-16 z-10">
          {mainNavItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
