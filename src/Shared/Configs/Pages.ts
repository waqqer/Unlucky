import { VictoryAudio } from "../Assets/Audio/VictoryAudio"
import { Victory } from "../Assets/Video/VictoryVideos"

interface IPagesConfig {
    MainPage_title: string[]
}

type VictoryScreen = {
    value_condition: number,
    data: {
        weight: number,
        video: string,
        audio?: string
    }[]
}

interface IVictoryScreenConfig {
    fade_duration: number
    counting_duration: number
    duration: number
    screens: VictoryScreen[]
}

export const PagesConfig: IPagesConfig = {
    MainPage_title: [
        "Где тебе сегодня повезет?",
        "Где поиграем?",
        "Куда депнем?",
        "Опять додеп?",
        "Да начнутся лудоприключения!",
        "Бэм бэм бэм...",
        "Виноград, сливыыыыы яблоки зеленыe",
        "Не ну нормально еще посидим, еще посидим",
        "Миллион двести на балансе"
    ]
} as const

export const VictoryScreenConfig: IVictoryScreenConfig = {
    duration: 2000,
    fade_duration: 2000,
    counting_duration: 3000,

    screens: [
        {
            value_condition: 0,
            data: [
                {
                    weight: 10,
                    video: Victory,
                    audio: VictoryAudio
                }
            ]
        }
    ]
} as const