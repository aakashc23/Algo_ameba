import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "!font-mono !text-[13px] !rounded-lg !border !shadow-lg !backdrop-blur-md",
          title: "!font-semibold !tracking-wide",
          description: "!text-xs !opacity-80",
          success:
            "!bg-[var(--toast-bg)] !text-[var(--toast-fg)] !border-[var(--toast-success)]/30",
          error:
            "!bg-[var(--toast-bg)] !text-[var(--toast-fg)] !border-[var(--toast-error)]/30",
          info: "!bg-[var(--toast-bg)] !text-[var(--toast-fg)] !border-[var(--toast-info)]/30",
          warning:
            "!bg-[var(--toast-bg)] !text-[var(--toast-fg)] !border-[var(--toast-border)]",
          closeButton:
            "!bg-[var(--toast-bg)] !border-[var(--toast-border)] !text-[var(--toast-fg)]",
          actionButton:
            "!bg-[var(--brand)] !text-[var(--brand-foreground)] !font-semibold !text-xs",
        },
      }}
      style={
        {
          "--normal-bg": "var(--toast-bg)",
          "--normal-text": "var(--toast-fg)",
          "--normal-border": "var(--toast-border)",
          "--success-bg": "var(--toast-bg)",
          "--success-text": "var(--toast-fg)",
          "--success-border": "var(--toast-success)",
          "--error-bg": "var(--toast-bg)",
          "--error-text": "var(--toast-fg)",
          "--error-border": "var(--toast-error)",
          "--info-bg": "var(--toast-bg)",
          "--info-text": "var(--toast-fg)",
          "--info-border": "var(--toast-info)",
          "--border-radius": "0.5rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
