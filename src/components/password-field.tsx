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

export function PasswordField({ id, label, icon, error, children, ...inputProps }: Props) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Field>
      <div className="flex items-center justify-between gap-5">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {children}
      </div>

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
