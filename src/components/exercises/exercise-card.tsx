import { PencilIcon, Trash2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type CustomExercise,
  type Exercise,
  exerciseDifficultyLabel,
  muscleGroupLabel,
  muscleLabel,
} from "@/lib/exercises/types"

interface Props {
  exercise: Exercise
  onDelete: (exercise: CustomExercise) => void
  onDetails: (exercise: Exercise) => void
  onEdit: (exercise: Exercise) => void
}

export function ExerciseCard({ exercise, onDelete, onDetails, onEdit }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-5">
          <CardTitle className="wrap-break-word normal-case tracking-normal">
            {exercise.name}
          </CardTitle>

          <Badge variant="secondary">
            {exercise.source === "default" ? "Padrão" : "Personalizado"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <p>
          <span className="text-muted-foreground">Grupo muscular: </span>
          {muscleGroupLabel[exercise.muscleGroup]}
        </p>

        <p>
          <span className="text-muted-foreground">Músculos principais: </span>
          {exercise.primaryMuscles.map(muscle => muscleLabel[muscle] ?? muscle).join(", ")}
        </p>

        <p>
          <span className="text-muted-foreground">Dificuldade: </span>
          {exerciseDifficultyLabel[exercise.difficulty]}
        </p>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-end gap-2 border-t">
        <Button
          onClick={() => onDetails(exercise)}
          size="sm"
          type="button"
          variant="outline"
        >
          Detalhes
        </Button>

        <Button
          aria-label={`Editar ${exercise.name}`}
          onClick={() => onEdit(exercise)}
          size="icon-sm"
          type="button"
          variant="blue"
        >
          <PencilIcon />
        </Button>

        {exercise.source === "custom" && (
          <Button
            aria-label={`Excluir ${exercise.name}`}
            onClick={() => onDelete(exercise)}
            size="icon-sm"
            type="button"
            variant="destructive"
          >
            <Trash2Icon />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
