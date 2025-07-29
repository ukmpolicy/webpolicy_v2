import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      richColors
      position="top-center"
      toastOptions={{
        classNames: {
          // --- PERUBAHAN: Tambahkan kelas animasi saat toast muncul ---
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success:
            "!bg-green-50 !border-green-200 !text-green-800 dark:!bg-green-950/50 dark:!border-green-800 dark:!text-green-200",
          error:
            "!bg-red-50 !border-red-200 !text-red-800 dark:!bg-red-950/50 dark:!border-red-800 dark:!text-red-200",
          // Animasi "pop-in" pada ikon tetap dipertahankan
          icon: "animate-in zoom-in-125",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
