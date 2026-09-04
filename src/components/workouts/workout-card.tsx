"use client"

import { CheckCircle2Icon, CopyIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Workout } from "@/lib/workouts/types"

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
          <Badge variant="secondary"> {workout.isActive ? "Ativa" : "Inativa"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {workout.description && (
          <p className="line-clamp-2 text-muted-foreground">{workout.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <p>
            <span className="text-muted-foreground">Dias: </span>
            {workout.days.length}
          </p>
          <p>
            <span className="text-muted-foreground">Atualizado: </span>
            {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
              workout.updatedAt.toDate()
            )}
          </p>
        </div>
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
