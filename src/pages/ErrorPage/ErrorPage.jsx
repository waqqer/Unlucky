import ErrorMessage from "@/widgets/error-message"
import LinkButton from "@/widgets/link-button/LinkButton"

const ErrorPage = (props) => {
    const {
        link,
        message,
        title
    } = props

    return (
        <div>
            <ErrorMessage title={title} desc={message} className="EnterFade">
                <LinkButton title="На главную" link="/Unlucky?" />
            </ErrorMessage>
        </div>
    )
}

export default ErrorPage