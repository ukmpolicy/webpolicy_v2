import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Gaya dasar: border, background, text, dll.
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",

        // Gaya untuk file input dan placeholder
        "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",

        // Gaya saat disabled
        "disabled:cursor-not-allowed disabled:opacity-50",

        // --- PERUBAHAN: Efek Fokus yang Lebih Halus & Modern ---
        // Hapus outline bawaan dan ganti dengan ring yang lebih lembut dan jelas
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background",

        // --- PERUBAHAN: Efek untuk state tidak valid (error) ---
        // Ganti ring yang tipis dengan border berwarna dan ring yang lebih jelas saat fokus
        "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/50",

        className
      )}
      {...props}
    />
  )
}

export { Input }
