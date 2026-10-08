"use client"

import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { type ReactNode } from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
  useComboboxPortalContainer,
} from "@/components/ui/combobox"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"

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
  placeholder?: string
  disabled?: boolean
  error?: { message?: string }
  description?: ReactNode
  onChange: (value: string[]) => void
}

function MultiSelectInputGroup({ ...props }: ComboboxPrimitive.InputGroup.Props) {
  return <ComboboxPrimitive.InputGroup render={<InputGroup />} {...props} />
}

export function MultiSelectField({
  id,
  label,
  value,
  icon,
  options,
  placeholder = "Selecione",
  disabled,
  error,
  description,
  onChange,
}: Props) {
  const anchor = useComboboxAnchor()
  const portalContainer = useComboboxPortalContainer(anchor)
  const selectedOptions = options.filter(option => value.includes(option.value))

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
        <MultiSelectInputGroup className="h-auto min-h-9" ref={anchor}>
          <InputGroupAddon>{icon}</InputGroupAddon>

          <ComboboxChips className="order-2 h-full min-w-0 flex-1 border-0 bg-transparent px-3 py-1.5 focus-within:border-0 has-data-[slot=combobox-chip]:px-3">
            <ComboboxValue>
              {selectedOptions.map(option => (
                <ComboboxChip key={option.value}>{option.label}</ComboboxChip>
              ))}
            </ComboboxValue>

            <ComboboxChipsInput
              disabled={disabled}
              id={id}
              placeholder={value.length === 0 ? placeholder : undefined}
            />
          </ComboboxChips>

          <InputGroupAddon align="inline-end" className="h-9 self-start pr-3">
            {selectedOptions.length > 0 && (
              <ComboboxClear
                aria-label={`Limpar ${label ?? "seleções"}`}
                disabled={disabled}
              />
            )}
            <ComboboxTrigger
              className="group-has-data-[slot=combobox-clear]/input-group:hidden"
              disabled={disabled}
            />
          </InputGroupAddon>
        </MultiSelectInputGroup>

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
