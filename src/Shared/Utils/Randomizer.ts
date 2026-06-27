export interface Weighted {
    weight: number
}

export const randomElement = <T>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)]
}

export const getByWeight = <T extends Weighted>(list: T[]): T => {
    const total = list.reduce((sum, s) => sum + s.weight, 0)
    let random = Math.floor(Math.random() * (total * 1000)) / 1000

    for(const i of list) {
        random -= i.weight
        if(random <= 0)
            return i
    }

    return list[0]
}

export const getManyByWeight = <T extends Weighted>(list: T[], count: number = 1): T[] => {
    const result: T[] = []
    
    for(let i = 0; i < count; i++) {
        result.push(getByWeight<T>(list))
    }

    return result
}