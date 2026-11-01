"use client"

import { useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { SessionFormValues } from "@/modules/sessions/domain/session"
import { SessionExerciseForm } from "./session-exercise-form"
import { hasCompletedAllWorkSets } from "./session-exercise-picker"

type SessionExerciseCarouselProps = {
  activeIndex: number
  onBack: () => void
  onSelect: (index: number) => void
  onSeriesCompleted: (seconds?: number) => void
  onWorkSetsCompleted: (index: number) => void
  pending: boolean
}

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest(
      "input, textarea, select, button, label, a, [contenteditable], [role=radio]"
    ) !== null
  )
}

export function SessionExerciseCarousel(props: SessionExerciseCarouselProps) {
  const { control } = useFormContext<SessionFormValues>()
  const exercises = useWatch({ control, name: "exercises" })
  const indexes = exercises
    .map((exercise, index) =>
      index === props.activeIndex || !hasCompletedAllWorkSets(exercise) ? index : null
    )
    .filter((index): index is number => index !== null)

  return (
    <ExerciseCarousel
      {...props}
      indexes={indexes}
      key={indexes.join(":")}
      totalExercises={exercises.length}
    />
  )
}

function ExerciseCarousel({
  activeIndex,
  indexes,
  onBack,
  onSelect,
  onSeriesCompleted,
  onWorkSetsCompleted,
  pending,
  totalExercises,
}: SessionExerciseCarouselProps & { indexes: number[]; totalExercises: number }) {
  const [api, setApi] = useState<CarouselApi>()
  const [startIndex] = useState(() => indexes.indexOf(activeIndex))

  useEffect(() => {
    if (!api) return
    const viewport = api.rootNode()
    let measuredWidth = 0
    let frame = 0
    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const width = viewport.offsetWidth
        if (!width || width === measuredWidth) return
        measuredWidth = width
        const track = api.containerNode()
        const previousWidth = track.style.width
        // A remoção temporária dos transforms pode alternar a barra de rolagem da página
        track.style.width = `${width}px`
        try {
          api.reInit()
        } finally {
          track.style.width = previousWidth
        }
      })
    })
    observer.observe(viewport)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [api])

  useEffect(() => {
    if (!api) return
    const alignActiveExercise = () => {
      const position = indexes.indexOf(activeIndex)
      if (position >= 0) api.scrollTo(position, true)
    }
    alignActiveExercise()
    api.on("reInit", alignActiveExercise)
    return () => {
      api.off("reInit", alignActiveExercise)
    }
  }, [activeIndex, api, indexes])

  useEffect(() => {
    if (!api) return
    const snapToSelection = () => api.scrollTo(api.selectedScrollSnap(), true)
    const select = () => {
      snapToSelection()
      const index = indexes[api.selectedScrollSnap()]
      if (index !== undefined && index !== activeIndex) onSelect(index)
    }
    api.on("select", select)
    api.on("pointerUp", snapToSelection)
    return () => {
      api.off("select", select)
      api.off("pointerUp", snapToSelection)
    }
  }, [activeIndex, api, indexes, onSelect])

  return (
    <Carousel
      aria-label="Exercícios do treino"
      aria-roledescription="carrossel"
      className="w-full min-w-0 max-w-full rounded-4xl outline-none focus-visible:ring-2 focus-visible:ring-ring [touch-action:pan-y_pinch-zoom] *:data-[slot=carousel-content]:overflow-clip"
      onKeyDownCapture={event => {
        if (pending || isInteractiveTarget(event.target)) return
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          api?.scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          api?.scrollNext()
        }
      }}
      opts={{
        startIndex,
        loop: indexes.length > 1,
        align: "start",
        duration: 0,
        watchResize: false,
        skipSnaps: false,
        watchDrag: pending
          ? false
          : (_carousel, event) => !isInteractiveTarget(event.target),
      }}
      setApi={setApi}
      tabIndex={0}
    >
      <CarouselContent className="ml-0 items-start">
        {indexes.map(index => (
          <CarouselItem
            aria-hidden={index !== activeIndex}
            aria-label={`Exercício ${index + 1} de ${totalExercises}`}
            aria-roledescription="exercício"
            className={`w-full max-w-full px-1 py-1${index !== activeIndex ? " h-0" : ""}`}
            inert={index !== activeIndex}
            key={index}
          >
            <SessionExerciseForm
              index={index}
              onBack={onBack}
              onSeriesCompleted={onSeriesCompleted}
              onWorkSetsCompleted={() => onWorkSetsCompleted(index)}
              totalExercises={totalExercises}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {indexes.length > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Deslize para trocar de exercício</p>
          <div className="flex items-center gap-2">
            <CarouselPrevious
              aria-label="Exercício anterior não finalizado"
              className="static translate-y-0"
              type="button"
            />
            <CarouselNext
              aria-label="Próximo exercício não finalizado"
              className="static translate-y-0"
              type="button"
            />
          </div>
        </div>
      )}
    </Carousel>
  )
}
