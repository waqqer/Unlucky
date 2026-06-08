import type { ReactNode } from "react"

export interface Classable {
    className?: string
}

export interface Parent {
    children?: ReactNode
}

export interface Identical {
    id?: string
}

export interface Clickable {
    onClick?: () => void
}