import type { Clickable } from "@/Shared/Types/PropsTypes";
import type { MouseEventHandler } from "react";

export interface BaseButton extends Clickable {
    onHoverStart?: MouseEventHandler
    onHoverEnd?: MouseEventHandler
    onHoverMove?: MouseEventHandler
}

export interface BaseLinkButton extends Clickable {
    onHoverStart?: MouseEventHandler
    onHoverEnd?: MouseEventHandler
    onHoverMove?: MouseEventHandler

    to: string
}