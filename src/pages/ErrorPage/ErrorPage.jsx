import PreviewTitle from "@/widgets/preview-title"
import LinkButton from "@/widgets/link-button"

const ErrorPage = (props) => {
    const {
        link,
        message,
        title
    } = props

    return (
        <div>
            <h1>{title}</h1>
            <p>{message}</p>

            <LinkButton link={link} title="На главную" />
        </div>
    )
}

export default ErrorPage