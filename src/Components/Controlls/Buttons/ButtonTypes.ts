import type { Parent, Clickable, Classable } from "@/Shared/Types/PropsTypes";

export interface UIBaseButton extends Clickable, Parent, Classable {
    type?: UIButtonType
}

export interface UILinkedBaseButton extends Clickable, Parent, Classable {
    to?: string
    type?: UIButtonType
}

export type UIButtonType = "PRIMARY" | "SECONDARY" | "DANGER" | "SUCCES" | "DEFAULT" | "TEXT"