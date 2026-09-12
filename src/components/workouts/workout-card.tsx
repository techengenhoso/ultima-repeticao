"use client"

import { CheckCircle2Icon, CopyIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Workout } from "@/modules/workouts/domain/workout"

function formatUpdatedAt(updatedAt: number, now = new Date()) {
  const updatedDate = new Date(updatedAt)
  const updatedDay = new Date(
    updatedDate.getFullYear(),
    updatedDate.getMonth(),
    updatedDate.getDate()
  )
  const currentDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const daysSinceUpdate = Math.max(
    0,
    Math.round((currentDay.getTime() - updatedDay.getTime()) / 86_400_000)
  )
  const monthsSinceUpdate = Math.max(
    0,
    (now.getFullYear() - updatedDate.getFullYear()) * 12 +
      now.getMonth() -
      updatedDate.getMonth() -
      Number(now.getDate() < updatedDate.getDate())
  )
  const yearsSinceUpdate = Math.floor(monthsSinceUpdate / 12)

  if (daysSinceUpdate === 0) return "hoje"

  if (yearsSinceUpdate > 0)
    return `há ${yearsSinceUpdate} ${yearsSinceUpdate === 1 ? "ano" : "anos"}`

  if (monthsSinceUpdate > 0)
    return `há ${monthsSinceUpdate} ${monthsSinceUpdate === 1 ? "mês" : "meses"}`

  if (daysSinceUpdate === 1) return "há 1 dia"
  return `há ${daysSinceUpdate} dias`
}

interface Props {
  isActivating: boolean
  onActivate: (workout: Workout) => void
  onDeactivate: (workout: Workout) => void
  onDelete: (workout: Workout) => void
  onDetails: (workout: Workout) => void
  onDuplicate: (workout: Workout) => void
  onEdit: (workout: Workout) => void
  workout: Workout
}

export function WorkoutCard({
  isActivating,
  onActivate,
  onDeactivate,
  onDelete,
  onDetails,
  onDuplicate,
  onEdit,
  workout,
}: Props) {
  return (
    <Card className={workout.isActive ? "border-primary" : undefined}>
      <CardHeader>
        <div className="flex min-w-0 items-start justify-between gap-3">
          <CardTitle className="min-w-0 wrap-break-word normal-case tracking-normal">
            {workout.name}
          </CardTitle>

          <Badge variant={workout.isActive ? "default" : "secondary"}>
            {workout.isActive ? "Ativa" : "Inativa"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          {workout.description ?? "Ficha sem descrição"}, existe {workout.days.length} dia
          {workout.days.length > 1 && "s"} de treino e a última atualização feita foi{" "}
          {formatUpdatedAt(workout.updatedAt)}
        </p>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-end gap-2 border-t">
        <Button
          onClick={() => onDetails(workout)}
          size="sm"
          type="button"
          variant="outline"
        >
          Detalhes
        </Button>

        <Button
          aria-label={`Duplicar ${workout.name}`}
          onClick={() => onDuplicate(workout)}
          size="icon-sm"
          type="button"
          variant="secondary"
        >
          <CopyIcon />
        </Button>

        <Button
          aria-label={
            workout.isActive ? `Desativar ${workout.name}` : `Ativar ${workout.name}`
          }
          disabled={isActivating}
          onClick={() => (workout.isActive ? onDeactivate(workout) : onActivate(workout))}
          size="icon-sm"
          type="button"
          variant="secondary"
        >
          <CheckCircle2Icon />
        </Button>

        <Button
          aria-label={`Editar ${workout.name}`}
          onClick={() => onEdit(workout)}
          size="icon-sm"
          type="button"
          variant="blue"
        >
          <PencilIcon />
        </Button>

        <Button
          aria-label={`Excluir ${workout.name}`}
          onClick={() => onDelete(workout)}
          size="icon-sm"
          type="button"
          variant="destructive"
        >
          <Trash2Icon />
        </Button>
      </CardFooter>
    </Card>
  )
}
