import { EyeIcon, EyeOffIcon } from "lucide-react"
import { type ComponentProps, type ReactNode, useState } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

type Props = ComponentProps<typeof InputGroupInput> & {
  id: string
  label: string
  icon: ReactNode
  error?: { message?: string }
}

export function InputFieldPassword({ id, label, icon, error, ...inputProps }: Props) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <InputGroup>
        <InputGroupInput
          {...inputProps}
          id={id}
          type={showPassword ? "text" : "password"}
        />

        <InputGroupAddon>{icon}</InputGroupAddon>

        <InputGroupAddon align="inline-end">
          <InputGroupButton
            aria-label={showPassword ? "Ocultar senhas" : "Mostrar senhas"}
            onClick={() => setShowPassword(current => !current)}
            type="button"
          >
            {showPassword ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>

      <FieldError errors={[error]} />
    </Field>
  )
}
