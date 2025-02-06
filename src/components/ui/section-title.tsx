interface SectionTitleProps {
  children: React.ReactNode
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="text-lg font-bold text-gray-900">
      {children}
    </h2>
  )
} 