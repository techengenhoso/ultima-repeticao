"use client"

import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { type ReactNode } from "react"
import {
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  useComboboxAnchor,
  useComboboxPortalContainer,
} from "@/components/ui/combobox"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

interface Option {
  label: string
  value: string
}

interface Props {
  id: string
  label?: string
  value: string
  icon: ReactNode
  options: readonly Option[]
  disabled?: boolean
  error?: { message?: string }
  description?: ReactNode
  onChange: (value: string) => void
}

function ComboboxInputGroup({ ...props }: ComboboxPrimitive.InputGroup.Props) {
  return <ComboboxPrimitive.InputGroup render={<InputGroup />} {...props} />
}

export function ComboboxField({
  id,
  label,
  value,
  icon,
  options,
  disabled,
  error,
  description,
  onChange,
}: Props) {
  const anchor = useComboboxAnchor()
  const portalContainer = useComboboxPortalContainer(anchor)
  const selectedOption = options.find(option => option.value === value) ?? null

  return (
    <Field>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <Combobox
        disabled={disabled}
        items={options}
        onValueChange={selected => onChange(selected?.value ?? "")}
        value={selectedOption}
      >
        <ComboboxInputGroup ref={anchor}>
          <InputGroupAddon>{icon}</InputGroupAddon>

          <ComboboxPrimitive.Input
            aria-describedby={error ? `${id}-error` : undefined}
            disabled={disabled}
            id={id}
            placeholder="Selecione"
            render={<InputGroupInput />}
          />

          <InputGroupAddon align="inline-end">
            {selectedOption && (
              <ComboboxClear aria-label={`Limpar ${label ?? "seleção"}`} />
            )}
            <ComboboxTrigger disabled={disabled} />
          </InputGroupAddon>
        </ComboboxInputGroup>

        <ComboboxContent anchor={anchor} container={portalContainer}>
          <ComboboxEmpty>Nenhuma opção encontrada</ComboboxEmpty>

          <ComboboxList>
            {option => (
              <ComboboxItem key={option.value} value={option}>
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {description && (
        <FieldDescription id={`${id}-description`}>{description}</FieldDescription>
      )}

      <FieldError errors={[error]} id={`${id}-error`} />
    </Field>
  )
}
