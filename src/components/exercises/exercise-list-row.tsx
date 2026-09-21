import { EyeIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  type CustomExercise,
  type Exercise,
  exerciseDifficultyLabel,
  muscleGroupLabel,
  muscleLabel,
} from "@/modules/exercises/domain/exercise"

interface Props {
  exercise: Exercise
  onDelete: (exercise: CustomExercise) => void
  onDetails: (exercise: Exercise) => void
  onEdit: (exercise: Exercise) => void
}

export function ExerciseListRow({ exercise, onDelete, onDetails, onEdit }: Props) {
  const primaryMuscles = exercise.primaryMuscles
    .map(muscle => muscleLabel[muscle] ?? muscle)
    .join(", ")

  return (
    <TableRow>
      <TableCell className="min-w-0 text-center whitespace-normal">
        <div className="flex flex-col items-center text-center">
          <p className="font-medium wrap-break-word">{exercise.name}</p>

          <p className="mt-1 text-xs text-muted-foreground">
            {muscleGroupLabel[exercise.muscleGroup]}
          </p>
        </div>
      </TableCell>

      <TableCell className="hidden text-center whitespace-normal text-muted-foreground sm:table-cell">
        <div className="flex justify-center text-center">{primaryMuscles}</div>
      </TableCell>

      <TableCell className="hidden text-center whitespace-normal text-muted-foreground lg:table-cell">
        <div className="flex justify-center text-center">
          {exerciseDifficultyLabel[exercise.difficulty]}
        </div>
      </TableCell>

      <TableCell className="w-[140px]">
        <div className="flex justify-center gap-1">
          <Button
            aria-label={`Ver detalhes de ${exercise.name}`}
            onClick={() => onDetails(exercise)}
            size="icon-sm"
            type="button"
            variant="secondary"
          >
            <EyeIcon />
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
        </div>
      </TableCell>
    </TableRow>
  )
}
