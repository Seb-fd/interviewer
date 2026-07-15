import { Shield, Users, Zap, ShoppingCart, Glasses, BookOpen, Code, Database, Lock, Wifi, Layers, TestTube } from 'lucide-react'

const iconMap = {
  Shield: Shield,
  Users: Users,
  Zap: Zap,
  ShoppingCart: ShoppingCart,
  Glass: Glasses,
  BookOpen: BookOpen,
  Code: Code,
  Database: Database,
  Lock: Lock,
  Wifi: Wifi,
  Layers: Layers,
  TestTube: TestTube,
}

interface CategoryIconProps {
  name: string
  className?: string
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
  const IconComponent = iconMap[name as keyof typeof iconMap] || Shield
  return <IconComponent className={className} />
}
