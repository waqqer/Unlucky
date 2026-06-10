import type { Clickable } from "@/Shared/Types/PropsTypes";
import type { MouseEventHandler } from "react";

export interface BaseButton extends Clickable {
    onHoverStart?: MouseEventHandler
    onHoverEnd?: MouseEventHandler
    onHoverMove?: MouseEventHandler

    disabled?: boolean
}

export interface BaseLinkButton extends Clickable {
    onHoverStart?: MouseEventHandler
    onHoverEnd?: MouseEventHandler
    onHoverMove?: MouseEventHandler

    to: string
}

export const ButtonStyle = {
    PRIMARY: "primary",
    SECONDARY: "secondary",
    DANGER: "danger",
    APPLY: "apply"
} as const

export type ButtonStyle = typeof ButtonStyle[keyof typeof ButtonStyle] 