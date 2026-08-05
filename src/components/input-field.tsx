import type { ComponentProps, ReactNode } from "react"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

type Props = ComponentProps<typeof InputGroupInput> & {
  id: string
  label: string
  icon: ReactNode
  iconRight?: ReactNode
  error?: { message?: string }
}

export function InputField({ id, label, icon, iconRight, error, ...props }: Props) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <InputGroup>
        <InputGroupAddon>{icon}</InputGroupAddon>

        <InputGroupInput id={id} {...props} />

        {iconRight && <InputGroupAddon align="inline-end">{iconRight}</InputGroupAddon>}
      </InputGroup>

      <FieldError errors={[error]} />
    </Field>
  )
}
