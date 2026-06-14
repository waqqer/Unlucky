import { createContext, useMemo, useState } from "react"

export interface SettingsContextValues { 
    sound: SoundSettigns
}

type SoundSettigns = {
    volume: number,
    enable: boolean
}

export const SettingsContext = createContext<SettingsContextValues>(undefined!)

export const SettingsProvider = ({ children }: any) => {
    const [sound, _] = useState<SoundSettigns>({ volume: 1, enable: true })

    const values: SettingsContextValues = useMemo(() => ({
        sound
    }), [sound])

    return (
        <SettingsContext.Provider value={values}>
            {children}
        </SettingsContext.Provider>
    )
}