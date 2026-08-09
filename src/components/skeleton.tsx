import { Skeleton } from "./ui/skeleton"

export function Skeletons() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map(item => (
        <Skeleton className="h-52" key={item} />
      ))}
    </div>
  )
}
