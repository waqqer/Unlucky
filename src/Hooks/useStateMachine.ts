import { useCallback, useMemo, useState } from "react"

interface StateMachineConfig<T extends string> {
    onChange?: (state: T) => void
}

interface StateMachineData<T extends string> {
    currentState: T
    changeState: (new_state: T) => void
    resetState: () => void
    is: (st: T) => boolean
}

const useStateMachine = <T extends string>(initial: T, config?: StateMachineConfig<T>): StateMachineData<T> => {
    const {
        onChange
    } = config || {}

    const [state, setState] = useState<T>(initial)
    
    const currentState = useMemo(() => state, [state])

    const is = useCallback((st: T): boolean => {
        return state === st
    }, [state])

    const changeState = useCallback((new_state: T) => {
        if(state === new_state) return

        setState(new_state)
        onChange?.(new_state)
    }, [state, onChange])

    const resetState = useCallback(() => {
        setState(initial)
    }, [initial])

    return {
        currentState,
        changeState,
        resetState,
        is
    }
}

export default useStateMachine