"use client"

import { useCallback, useEffect, useState } from "react"
import { Skeletons } from "@/components/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import type { BodyAssessment } from "@/modules/body-assessments/domain/body-assessment"
import {
  type AssessmentGroup,
  groups,
} from "@/modules/body-assessments/presentation/fields"
import { useProgressUseCases } from "../progress-use-cases-context"
import { BodyAssessmentChart } from "./body-assessment-chart"
import { BodyAssessmentDetails } from "./body-assessment-details"
import { BodyAssessmentForm } from "./body-assessment-form"
import { BodyAssessmentHistory } from "./body-assessment-history"
import { BodyAssessmentIndicators } from "./body-assessment-indicators"

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`))
    .replaceAll(".", "")

export function BodyAssessmentsSection() {
  const progressUseCases = useProgressUseCases()
  const [items, setItems] = useState<BodyAssessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState<BodyAssessment | null>(null)
  const [creatingGroup, setCreatingGroup] = useState<AssessmentGroup | null>(null)
  const [choosingType, setChoosingType] = useState(false)
  const [viewing, setViewing] = useState<BodyAssessment | null>(null)
  const [deleting, setDeleting] = useState<BodyAssessment | null>(null)
  const [creatingDirty, setCreatingDirty] = useState(false)
  const [editingDirty, setEditingDirty] = useState(false)
  const [confirmingClose, setConfirmingClose] = useState<"creating" | "editing" | null>(
    null
  )

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await progressUseCases.listAssessments())
      setError("")
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Não foi possível carregar")
    } finally {
      setLoading(false)
    }
  }, [progressUseCases])

  useEffect(() => {
    void load()
  }, [load])

  const saved = (item: BodyAssessment) => {
    setItems(current => progressUseCases.replaceAssessment(current, item))
    setEditing(null)
    setCreatingGroup(null)
    setCreatingDirty(false)
    setEditingDirty(false)
  }

  const closeCreating = () =>
    creatingDirty ? setConfirmingClose("creating") : setCreatingGroup(null)

  const closeEditing = () =>
    editingDirty ? setConfirmingClose("editing") : setEditing(null)

  const discardChanges = () => {
    if (confirmingClose === "creating") {
      setCreatingGroup(null)
      setCreatingDirty(false)
    }
    if (confirmingClose === "editing") {
      setEditing(null)
      setEditingDirty(false)
    }
    setConfirmingClose(null)
  }

  async function remove() {
    if (!deleting) return

    try {
      await progressUseCases.removeAssessment(deleting.id)
      setItems(current => progressUseCases.removeAssessmentFromList(current, deleting.id))
      setDeleting(null)
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Não foi possível excluir a avaliação"
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Avaliação corporal</h2>
          <p className="text-sm text-muted-foreground">
            Registre medidas e acompanhe suas variações
          </p>
        </div>
        <Button onClick={() => setChoosingType(true)}>Nova avaliação</Button>
      </div>
      <Dialog onOpenChange={setChoosingType} open={choosingType}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Tipo de avaliação corporal</DialogTitle>
            <DialogDescription>
              Escolha o tipo de medida que deseja cadastrar
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-3">
            {groups.map(group => (
              <Button
                className="h-auto min-h-24 whitespace-normal"
                key={group.key}
                onClick={() => {
                  setChoosingType(false)
                  setCreatingGroup(group.key)
                }}
                type="button"
                variant="outline"
              >
                {group.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      {creatingGroup && (
        <AssessmentDialog
          description={`Registre a data e as medidas de ${groups.find(group => group.key === creatingGroup)?.label.toLocaleLowerCase("pt-BR")}`}
          onOpenChange={closeCreating}
          title="Nova avaliação corporal"
        >
          <BodyAssessmentForm
            group={creatingGroup}
            onCancel={closeCreating}
            onDirtyChange={setCreatingDirty}
            onDone={saved}
          />
        </AssessmentDialog>
      )}
      {editing && (
        <AssessmentDialog
          description="Atualize a data e as medidas disponíveis para esta avaliação"
          onOpenChange={closeEditing}
          title="Editar avaliação corporal"
        >
          <BodyAssessmentForm
            item={editing}
            onCancel={closeEditing}
            onDirtyChange={setEditingDirty}
            onDone={saved}
          />
        </AssessmentDialog>
      )}
      {loading ? (
        <Skeletons cards={4} />
      ) : error ? (
        <div role="alert">
          <p className="text-destructive">{error}</p>
          <Button className="mt-2" onClick={() => void load()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      ) : items.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>Nenhuma avaliação cadastrada</EmptyTitle>
            <EmptyDescription>Crie uma avaliação para acompanhamento</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <BodyAssessmentIndicators assessments={items} />
          <BodyAssessmentChart assessments={items} />
          <section className="space-y-3" id="assessment-history">
            <h2 className="text-xl font-bold">Histórico de avaliações</h2>
            <BodyAssessmentHistory
              items={items}
              onDelete={setDeleting}
              onEdit={setEditing}
              onView={setViewing}
            />
          </section>
        </>
      )}
      <Dialog onOpenChange={open => !open && setViewing(null)} open={Boolean(viewing)}>
        <DialogContent className="flex max-h-[calc(100dvh-2rem)] min-w-0 flex-col gap-4 overflow-hidden p-4 sm:max-w-xl sm:p-6">
          <DialogHeader>
            <DialogTitle>
              Avaliação de {viewing && formatDate(viewing.assessmentDate)}
            </DialogTitle>
            <DialogDescription>
              Medidas registradas nesta avaliação corporal
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto overscroll-contain scrollbar-none [&::-webkit-scrollbar]:hidden">
            {viewing && <BodyAssessmentDetails item={viewing} />}
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog
        onOpenChange={open => !open && setDeleting(null)}
        open={Boolean(deleting)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir avaliação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => void remove()} variant="destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        onOpenChange={open => !open && setConfirmingClose(null)}
        open={Boolean(confirmingClose)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Descartar alterações</AlertDialogTitle>
            <AlertDialogDescription>
              Os dados preenchidos nesta avaliação não serão salvos. Esta ação não poderá
              ser desfeita
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar editando</AlertDialogCancel>
            <Button onClick={discardChanges} variant="destructive">
              Descartar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
function AssessmentDialog({
  children,
  description,
  onOpenChange,
  title,
}: {
  children: React.ReactNode
  description: string
  onOpenChange: () => void
  title: string
}) {
  return (
    <Dialog onOpenChange={open => !open && onOpenChange()} open>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] min-w-0 flex-col gap-4 overflow-hidden p-4 sm:max-w-xl sm:p-6">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
