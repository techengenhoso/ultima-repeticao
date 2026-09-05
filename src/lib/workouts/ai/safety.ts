import type { AiWorkoutInput } from "./schemas"

export const safetyMessage = "Leia e confirme a informação de segurança para continuar"

export function getSafetyBlock(
  input: Pick<AiWorkoutInput, "safetyConfirmed" | "safetyFlags">
) {
  if (input.safetyFlags.length > 0)
    return "Não é possível gerar a ficha com uma situação de segurança marcada, procure orientação profissional"

  return input.safetyConfirmed ? null : safetyMessage
}
