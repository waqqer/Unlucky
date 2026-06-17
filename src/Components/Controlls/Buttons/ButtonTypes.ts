import type { Parent, Clickable, Classable, Linked, Identical } from "@/Shared/Types/PropsTypes"

export interface UIBaseButton extends Clickable, Parent, Classable, Identical {
    type?: UIButtonType,
    sound?: boolean
}

export interface UILinkedBaseButton extends UIBaseButton, Clickable, Parent, Classable, Linked {
    icon?: boolean,
    sound?: boolean
}

export interface UIKeybindedButton extends UIBaseButton, Clickable, Parent, Classable {
    bind: string,
    sound?: boolean
}

export interface UIBaseSocialButton extends Clickable, Parent {
    social: UISocial
    link: string
}

export type UIButtonType = "PRIMARY" | "SECONDARY" | "DANGER" | "SUCCES" | "DEFAULT" | "TEXT"
export type UISocial = "telegram" | "youtube"