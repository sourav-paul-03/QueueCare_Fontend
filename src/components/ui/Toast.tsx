import { useState } from 'react'

export const Toast = () => {
  const [toasts] = useState<{ id: number; message: string; type: 'success' | 'error' | 'info' }[]>([])

  const typeColors: Record<string, string> = {
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  }

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto ${typeColors[t.type]} border px-4 py-3 rounded-lg shadow-lg min-w-[300px] animate-in fade-in slide-in-from-top-2 duration-300`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}