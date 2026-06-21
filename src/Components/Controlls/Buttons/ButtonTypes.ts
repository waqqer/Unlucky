import type { Parent, Clickable, Classable, Linked, Identical } from "@/Shared/Types/PropsTypes"

export interface UIBaseButton extends Clickable, Parent, Classable, Identical {
    type?: UIButtonType
    sound?: boolean
    isDisabled?: boolean
}

export interface UILinkedBaseButton extends UIBaseButton, Clickable, Parent, Classable, Linked {
    icon?: boolean
    sound?: boolean
    isDisabled?: boolean
}

export interface UIKeybindedButton extends UIBaseButton, Clickable, Parent, Classable {
    bind: string
    sound?: boolean
    isDisabled?: boolean
}

export interface UIBaseSocialButton extends Clickable, Parent {
    social: UISocial
    link: string
    sound?: boolean
}

export type UIButtonType = "PRIMARY" | "SECONDARY" | "DANGER" | "SUCCES" | "DEFAULT" | "TEXT"
export type UISocial = "telegram" | "youtube"