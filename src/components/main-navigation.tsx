"use client"

import {
  ActivityIcon,
  ClipboardListIcon,
  DumbbellIcon,
  HistoryIcon,
  HomeIcon,
  UserIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const navigationItems = [
  { href: "/", icon: HomeIcon, label: "Início" },
  { href: "/workouts", icon: ClipboardListIcon, label: "Meus treinos" },
  { href: "/exercises", icon: DumbbellIcon, label: "Exercícios" },
  { href: "/history", icon: HistoryIcon, label: "Histórico" },
  { href: "/progress", icon: ActivityIcon, label: "Evolução" },
  { href: "/profile", icon: UserIcon, label: "Perfil" },
]

function isCurrentRoute(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname.startsWith(href)
}

export function MainNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname()

  return (
    <nav aria-label="Navegação principal" className={mobile ? "w-full" : undefined}>
      <ul className={cn(mobile ? "grid grid-cols-6" : "flex flex-col gap-1 px-3")}>
        {navigationItems.map(item => {
          const isActive = isCurrentRoute(pathname, item.href)
          const Icon = item.icon

          return (
            <li key={item.href}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  mobile
                    ? "min-h-16 flex-col items-center justify-center gap-1 px-0.5 text-[0.625rem] font-medium"
                    : "h-11 items-center gap-3 px-3 text-sm font-medium",
                  isActive &&
                    (mobile
                      ? "bg-chart-5/10 text-chart-5"
                      : "bg-chart-5 text-primary-foreground")
                )}
                href={item.href}
              >
                <Icon aria-hidden="true" className={mobile ? "size-5" : "size-4"} />

                <span className={mobile ? "text-center leading-tight" : undefined}>
                  {item.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
