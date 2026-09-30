"use client"

import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { DumbbellIcon } from "lucide-react"
import {
  Combobox,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import type { PerformanceExerciseOption } from "./performance-types"

export function PerformanceExerciseSelector({
  onSelect,
  options,
  selected,
}: {
  onSelect: (key: string) => void
  options: PerformanceExerciseOption[]
  selected: string
}) {
  const anchor = useComboboxAnchor()
  const selectedOption = options.find(option => option.key === selected) ?? null
  const exerciseGroups = [{ items: options, key: "exercises" }]

  return (
    <div className="w-full sm:w-64">
      <Combobox
        items={exerciseGroups}
        itemToStringLabel={option => option.name}
        itemToStringValue={option => option.key}
        onValueChange={option => onSelect(option?.key ?? "")}
        value={selectedOption}
      >
        <ComboboxPrimitive.InputGroup ref={anchor} render={<InputGroup />}>
          <InputGroupAddon>
            <DumbbellIcon aria-hidden="true" />
          </InputGroupAddon>
          <ComboboxPrimitive.Input
            aria-label="Exercício analisado"
            id="performance-exercise"
            placeholder="Selecione"
            render={<InputGroupInput />}
          />
          <InputGroupAddon align="inline-end">
            {selectedOption && <ComboboxClear aria-label="Limpar exercício" />}
            <ComboboxTrigger aria-label="Abrir exercícios" />
          </InputGroupAddon>
        </ComboboxPrimitive.InputGroup>

        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>Nenhum exercício encontrado</ComboboxEmpty>
          <ComboboxList>
            {group => (
              <ComboboxGroup items={group.items} key={group.key}>
                <ComboboxCollection>
                  {(option: PerformanceExerciseOption) => (
                    <ComboboxItem key={option.key} value={option}>
                      {option.name}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
