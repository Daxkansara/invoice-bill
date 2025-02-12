"use client"

import React, { useState, type ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null)

  const handleError = (error: Error) => {
    setError(error)
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline">Something went wrong: {error.message}</span>
      </div>
    )
  }

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child as React.ReactElement, { onError: handleError }),
      )}
    </div>
  )
}

