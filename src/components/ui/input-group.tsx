import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/input-group relative flex h-11 w-full items-center border border-input bg-transparent shadow-xs transition-[color,box-shadow] outline-none has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30 has-[[data-slot=input-group-control][aria-invalid=true]]:border-destructive has-[[data-slot=input-group-control][aria-invalid=true]]:ring-2 has-[[data-slot=input-group-control][aria-invalid=true]]:ring-destructive/20 dark:bg-input/30 dark:has-[[data-slot=input-group-control][aria-invalid=true]]:ring-destructive/40",
        className
      )}
      data-slot="input-group"
      {...props}
    />
  )
}

function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <Input
      className={cn(
        "order-2 h-full flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      )}
      data-slot="input-group-control"
      {...props}
    />
  )
}

function InputGroupTextArea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      className={cn(
        "order-2 min-h-20 flex-1 resize-y border-0 bg-transparent px-3 py-3 shadow-none focus-visible:border-0 focus-visible:ring-0",
        className
      )}
      data-slot="input-group-control"
      {...props}
    />
  )
}

function InputGroupAddon({
  align = "inline-start",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "inline-start" | "inline-end"
}) {
  return (
    <div
      className={cn(
        "flex h-full shrink-0 items-center justify-center text-muted-foreground [&>svg]:pointer-events-none [&>svg]:size-4",
        align === "inline-start" ? "order-1 pl-3" : "order-3 pr-1",
        className
      )}
      data-align={align}
      data-slot="input-group-addon"
      {...props}
    />
  )
}

function InputGroupButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn("size-9", className)}
      data-slot="input-group-button"
      size="icon-sm"
      variant="ghost"
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextArea as InputGroupTextarea,
}
