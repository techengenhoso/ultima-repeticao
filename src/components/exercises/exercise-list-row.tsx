import { EyeIcon, PencilIcon, RotateCcwIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import {
  type CustomExercise,
  type DefaultExercise,
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
  onRestore: (exercise: DefaultExercise) => void
}

export function ExerciseListRow({
  exercise,
  onDelete,
  onDetails,
  onEdit,
  onRestore,
}: Props) {
  const primaryMuscles = exercise.primaryMuscles
    .map(muscle => muscleLabel[muscle] ?? muscle)
    .join(", ")

  return (
    <Item className="gap-3" variant="muted">
      <ItemContent className="min-w-0">
        <ItemTitle className="line-clamp-none wrap-break-word">{exercise.name}</ItemTitle>

        <ItemDescription className="mt-0.5">
          {muscleGroupLabel[exercise.muscleGroup]} ·{" "}
          {exerciseDifficultyLabel[exercise.difficulty]} · {primaryMuscles}
        </ItemDescription>
      </ItemContent>

      <ItemActions className="shrink-0 gap-1">
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
          variant="secondary"
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

        {exercise.source === "default" && exercise.isCustomized && (
          <Button
            aria-label={`Restaurar versão padrão de ${exercise.name}`}
            onClick={() => onRestore(exercise)}
            size="icon-sm"
            type="button"
            variant="secondary"
          >
            <RotateCcwIcon />
          </Button>
        )}
      </ItemActions>
    </Item>
  )
}
