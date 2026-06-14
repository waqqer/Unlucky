import type { Classable, Identical, Parent } from "@/Shared/Types/PropsTypes";

export interface UIBaseContainer extends Classable, Parent, Identical {
    justify?: "start" | "end" | "center" | "space-around" | "space-between" | "space-evenly"
}