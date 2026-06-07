class Randomizer {
    public static getRandomEl<T>(array: T[]): T {
        const i = Math.round(Math.random() * array.length - 1)
        return array[i]
    }
}

export default Randomizer