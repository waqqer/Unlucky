import ErrorTitle from "@/components/Title"

const NotFoundTitle = () => {
    return (
        <ErrorTitle title="Упс! Кажется, здесь кто-то всё сломал..." desc="Страница, которую вы ищете, либо удалена, либо никогда не существовала!" />
    )
}

export default NotFoundTitle