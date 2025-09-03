'use client'

import Toast from './Toast'
import { useToast } from '@/hooks/useToast'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </>
  )
}