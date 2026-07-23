import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LucideIcon, ArrowRight } from 'lucide-react'

interface StudyModeCardProps {
  icon: LucideIcon
  title: string
  description: string
  to: string
  cta?: string
  iconClassName?: string
  variant?: 'default' | 'primary'
}

export function StudyModeCard({
  icon: Icon,
  title,
  description,
  to,
  cta,
  iconClassName,
  variant = 'default',
}: StudyModeCardProps) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-md',
        variant === 'primary' && 'border-primary/30 bg-primary/5'
      )}
    >
      <CardHeader>
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110',
            iconClassName ?? 'bg-primary/10 text-primary'
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant={variant === 'primary' ? 'default' : 'outline'} className="w-full gap-2">
          <Link to={to}>
            {cta ?? 'Start'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
