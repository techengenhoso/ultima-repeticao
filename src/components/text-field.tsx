import { CircleHelpIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Props = ComponentProps<typeof InputGroupInput> & {
  id: string
  label?: string
  tooltip?: string
  icon: ReactNode
  iconRight?: ReactNode
  error?: { message?: string }
  description?: ReactNode
}

export function TextField({
  id,
  label,
  tooltip,
  icon,
  iconRight,
  error,
  description,
  ...props
}: Props) {
  return (
    <Field>
      {label && (
        <div className="flex h-5 items-center gap-1">
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label={tooltip}
                  className="size-4 p-0 text-muted-foreground"
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                >
                  <CircleHelpIcon aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6}>
                {tooltip}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}

      <InputGroup>
        <InputGroupAddon>{icon}</InputGroupAddon>

        <InputGroupInput id={id} {...props} />

        {iconRight && <InputGroupAddon align="inline-end">{iconRight}</InputGroupAddon>}
      </InputGroup>

      {description && (
        <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
      )}

      <FieldError errors={[error]} id={`${id}-error`} />
    </Field>
  )
}
