import LinkButton from "@/components/LinkButton"
import ModalExitButton from "@/components/ModalExitButton"
import { memo, useCallback, useContext } from "react"
import { AccountContext } from "@/context/AccountContext"
import useSPW from "@/hooks/useSPW"
import styles from "./AboutUsModal.module.css"
import Button from "@/components/Button/Button"
import Icon from "@/shared/images/logo.webp"
import { Link } from "react-router"

const AboutUsModal = (props) => {
    const {
        close
    } = props

    const { spm, account, termsAccepted } = useContext(AccountContext)

    const openTelegram = useCallback(() => {
        if (spm) {
            spm.openURL("https://t.me/shadowmonya")
        }
    }, [spm])

    const openYT = useCallback(() => {
        if (spm) {
            spm.openURL("https://youtube.com/@ShadowMonya")
        }
    }, [spm])

    const getDate = useCallback(() => {
        if(!account && !account.terms_accept_date)
            return "Ошибка!"

        const date = new Date(account.terms_accept_date);
        const time = date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        })
        return time
    }, [account])

    return (
        <>
            <ModalExitButton modal={close} />
            <img
                src={Icon}
                alt=""
                className={`mobile-hide`}
                width={258}
            />
            <h1 className={styles.title}>О проекте Unlucky</h1>

            <p className={styles.desc}>
                <b>Unlucky</b> - Онлайн казино на сервере СПм. Мы предоставляем вам игры, для веселого проведения досуга.

                <br />
                <br />

                Наша цель - дать вам еще один способ развлечься, и при этом
                <br /> возможность пополнить свой капитал.
            </p>

            <div className={styles["btn-box"]}>
                <div className={styles.buttons}>
                    {spm !== null ? (
                        <>
                            <Button onClick={openTelegram} className={`${styles["btn"]} ${styles["telegram"]}`} >
                                <i className="fab fa-telegram-plane"></i>
                                Telegram
                            </Button>

                            <Button onClick={openYT} className={`${styles["btn"]} ${styles["yt"]}`} >
                                <i className="fab fa-youtube"></i>
                                YouTube
                            </Button>
                        </>
                    ) : (
                        <>
                            <LinkButton to="https://t.me/shadowmonya" className={`${styles["btn"]} ${styles["telegram"]}`} external>
                                <i className="fab fa-telegram-plane"></i>
                                Telegram
                            </LinkButton>

                            <LinkButton to="https://youtube.com/@ShadowMonya" className={`${styles["btn"]} ${styles["yt"]}`} external>
                                <i className="fab fa-youtube"></i>
                                YouTube
                            </LinkButton>
                        </>
                    )}
                </div>
                <Link to="/terms" className={styles.terms}>Условия пользования Unlucky</Link>
                {termsAccepted() && account && <p className={styles.terms_date}>Дата принятия вами условий пользования: {getDate()}</p>}
            </div>
        </>
    )
}

export default memo(AboutUsModal)