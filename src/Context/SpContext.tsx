import useHead from "@/Hooks/userHead";
import useSP from "@/Hooks/useSP";
import type { UUID } from "@/Shared/Types/UserTypes";
import { createContext, type ReactNode } from "react";

export const SpContext = createContext({})

interface SpProviderProps {
    children?: ReactNode
}

export const SpProvider = (props: SpProviderProps) => {
    
}