import type { ComponentProps, ReactNode } from "react"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group"

type Props = ComponentProps<typeof InputGroupTextarea> & {
  id: string
  label?: string
  description?: ReactNode
  icon: ReactNode
  error?: { message?: string }
}

export function LongTextField({ id, label, description, icon, error, ...props }: Props) {
  return (
    <Field>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <InputGroup className="h-auto min-h-20 items-stretch">
        <InputGroupAddon className="h-auto self-stretch">{icon}</InputGroupAddon>

        <InputGroupTextarea id={id} {...props} />
      </InputGroup>

      {description && (
        <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
      )}

      <FieldError errors={[error]} id={`${id}-error`} />
    </Field>
  )
}
