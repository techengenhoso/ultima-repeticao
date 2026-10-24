import type { WorkoutSession } from "@/modules/sessions/domain/session"
import { workoutPerformance } from "./performance"

export type DashboardActivity = Pick<
  WorkoutSession,
  | "completedAt"
  | "exercises"
  | "id"
  | "startedAt"
  | "status"
  | "workoutDayName"
  | "workoutPlanName"
>

export type DashboardWorkout = {
  days: readonly unknown[]
  id: string
  isActive: boolean
}

export type DashboardSummary = {
  completedSessions: number
  completedSessionsThisMonth: number
  completedSessionsThisWeek: number
  recentActivities: DashboardActivity[]
  registeredWorkoutDays: number
  registeredWorkoutPlans: number
  weeklyGoal: {
    completedSessions: number
    targetSessions: number
  } | null
}

const activityDate = (session: DashboardActivity) =>
  session.completedAt ?? session.startedAt

function startOfCurrentWeek(now: number) {
  const date = new Date(now)
  const daysSinceMonday = (date.getDay() + 6) % 7

  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() - daysSinceMonday)

  return date.getTime()
}

function startOfCurrentMonth(now: number) {
  const date = new Date(now)

  date.setDate(1)
  date.setHours(0, 0, 0, 0)

  return date.getTime()
}

export function dashboardSummary(
  sessions: WorkoutSession[],
  workouts: DashboardWorkout[] = [],
  completedSessions?: number,
  now = Date.now()
): DashboardSummary {
  const performance = workoutPerformance(sessions, now)
  const currentMonthStart = startOfCurrentMonth(now)
  const currentWeekStart = startOfCurrentWeek(now)
  const currentWeekRows = performance.rows.filter(row => row.date >= currentWeekStart)
  const activeWorkout = workouts.find(workout => workout.isActive)
  const weeklyGoal = activeWorkout
    ? {
        completedSessions: sessions.filter(
          session =>
            session.status === "completed" &&
            session.workoutPlanId === activeWorkout.id &&
            activityDate(session) >= currentWeekStart
        ).length,
        targetSessions: activeWorkout.days.length,
      }
    : null

  return {
    completedSessions: completedSessions ?? performance.sessions,
    completedSessionsThisMonth: performance.rows.filter(
      row => row.date >= currentMonthStart
    ).length,
    completedSessionsThisWeek: currentWeekRows.length,
    recentActivities: sessions
      .filter(session => session.status === "completed" || session.status === "cancelled")
      .sort((left, right) => activityDate(right) - activityDate(left))
      .slice(0, 4),
    registeredWorkoutDays: workouts.reduce(
      (total, workout) => total + workout.days.length,
      0
    ),
    registeredWorkoutPlans: workouts.length,
    weeklyGoal,
  }
}
