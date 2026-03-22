import LinkButton from "@/components/LinkButton"
import ModalExitButton from "../../components/ModalExitButton"
import "./AboutUsModal.css"

const AboutUsModal = (props) => {
    const {
        close
    } = props

    return (
        <>
            <ModalExitButton modal={close} />
            <i className="about-us-modal-icon fa-solid fa-rocket"></i>
            <h1 className="about-us-modal title">О проекте Unlucky</h1>

            <p className="desc">
                <b>Unlucky</b> - Онлайн казино на сервере СПм. Мы предоставляем вам игры,
                <br /> для веселого проведения досуга.

                <br />
                <br />

                Наша цель - дать вам еще один способ развлечься, и при этом
                <br /> возможность пополнить свой капитал.
            </p>

            <div className="about-us-modal-social">
                <LinkButton to="https://t.me/shadowmonya" className="telegram social-btn" target="_blank" >
                    <i className="fab fa-telegram-plane"></i>
                    Telegram
                </LinkButton>

                <LinkButton to="https://youtube.com/@ShadowMonya" className="yt social-btn" target="_blank" >
                    <i className="fab fa-youtube"></i>
                    YouTube
                </LinkButton>
            </div>
        </>
    )
}

export default AboutUsModal