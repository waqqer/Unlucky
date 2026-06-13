import type { Parent, Clickable } from "@/Shared/Types/PropsTypes";

export interface UIBaseButton extends Clickable, Parent {
    className?: string
    type?: UIButtonType
}

export type UIButtonType = "PRIMARY" | "SECONDARY" | "DANGER" | "SUCCES" | "DEFAULT" | "TEXT"