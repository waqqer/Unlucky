export const randomElement = <T>(arr: T[]): T => {
    return arr[Math.round(Math.random() * arr.length - 1)]
}