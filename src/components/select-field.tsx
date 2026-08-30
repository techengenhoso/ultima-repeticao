import type { ReactNode } from "react"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  id: string
  label?: string
  value: string
  icon: ReactNode
  options: readonly { label: string; value: string }[]
  disabled?: boolean
  error?: { message?: string }
  description?: ReactNode
  onChange: (value: string) => void
}

export function SelectField({
  id,
  label,
  value,
  icon,
  options,
  error,
  description,
  onChange,
  ...props
}: Props) {
  return (
    <Field>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <Select
        {...props}
        onValueChange={value => onChange(value === "not-informed" ? "" : value)}
        value={value}
      >
        <InputGroup>
          <InputGroupAddon>{icon}</InputGroupAddon>

          <SelectTrigger
            className="order-2 h-full w-full flex-1 border-0 bg-transparent px-3 shadow-none focus-visible:border-0 focus-visible:ring-0"
            data-slot="input-group-control"
            id={id}
          >
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
        </InputGroup>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="not-informed">Não informar</SelectItem>

            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {description && (
        <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
      )}

      <FieldError errors={[error]} />
    </Field>
  )
}
