import type { Parent, Clickable, Classable, Linked } from "@/Shared/Types/PropsTypes";

export interface UIBaseButton extends Clickable, Parent, Classable {
    type?: UIButtonType
}

export interface UILinkedBaseButton extends UIBaseButton, Clickable, Parent, Classable, Linked {
    icon?: boolean
}

export interface UIKeybindedButton extends UIBaseButton, Clickable, Parent, Classable {
    bind: string
}

export interface UIBaseSocialButton extends Clickable, Parent {
    social: UISocial
    link: string
}

export type UIButtonType = "PRIMARY" | "SECONDARY" | "DANGER" | "SUCCES" | "DEFAULT" | "TEXT"
export type UISocial = "telegram" | "youtube"