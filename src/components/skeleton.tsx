import { Card, CardContent, CardHeader } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

const responsiveCards = [
  { className: "flex", key: "1" },
  { className: "hidden sm:flex", key: "2" },
  { className: "hidden lg:flex", key: "3" },
  { className: "hidden lg:flex", key: "4" },
  { className: "hidden lg:flex", key: "5" },
  { className: "hidden lg:flex", key: "6" },
]

export function Skeletons() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {responsiveCards.map(({ className, key }) => (
        <Card className={`gap-5 py-6 ${className}`} key={key}>
          <CardHeader className="gap-3">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-6 w-2/5" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-4/5" />
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
