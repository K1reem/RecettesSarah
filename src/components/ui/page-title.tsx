interface PageTitleProps {
  children: React.ReactNode
}

export function PageTitle({ children }: PageTitleProps) {
  return (
    <h1 className="text-2xl font-bold text-gray-900 mb-6">
      {children}
    </h1>
  )
} 