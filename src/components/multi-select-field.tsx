"use client"

import { type ReactNode, useCallback, useState } from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroupAddon } from "@/components/ui/input-group"

interface Option {
  label: string
  value: string
}

interface Props {
  id: string
  label?: string
  value: string[]
  icon: ReactNode
  options: readonly Option[]
  disabled?: boolean
  error?: { message?: string }
  description?: ReactNode
  onChange: (value: string[]) => void
}

export function MultiSelectField({
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
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)
  const selectedOptions = options.filter(option => value.includes(option.value))
  const setAnchor = useCallback(
    (node: HTMLDivElement | null) => {
      anchor.current = node
      setPortalContainer(node?.closest<HTMLElement>("[data-slot=dialog-content]") ?? null)
    },
    [anchor]
  )

  return (
    <Field>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}

      <Combobox
        disabled={disabled}
        items={options}
        multiple
        onValueChange={selected => onChange(selected.map(option => option.value))}
        value={selectedOptions}
      >
        <ComboboxInputGroup className="h-auto min-h-11" ref={setAnchor}>
          <InputGroupAddon>{icon}</InputGroupAddon>

          <ComboboxChips className="order-2 h-full min-w-0 flex-1 border-0 px-3 py-1.5 focus-within:border-0 has-data-[slot=combobox-chip]:px-3">
            {selectedOptions.map(option => (
              <ComboboxChip key={option.value}>{option.label}</ComboboxChip>
            ))}

            <ComboboxChipsInput
              aria-invalid={!!error}
              disabled={disabled}
              id={id}
              placeholder={value.length === 0 ? "Selecione" : undefined}
            />
          </ComboboxChips>

          <InputGroupAddon align="inline-end" className="h-11 self-start pr-3">
            <ComboboxTrigger disabled={disabled} />
          </InputGroupAddon>
        </ComboboxInputGroup>

        <ComboboxContent anchor={anchor} container={portalContainer}>
          <ComboboxEmpty>Nenhuma opção encontrada</ComboboxEmpty>

          <ComboboxList>
            {options.map(option => (
              <ComboboxItem key={option.value} value={option}>
                {option.label}
              </ComboboxItem>
            ))}
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
