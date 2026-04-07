import LinkButton from "@/components/LinkButton"
import ModalExitButton from "@/components/ModalExitButton"
import { memo, useCallback, useEffect, useState } from "react"
import useSPW from "@/hooks/useSPW"
import styles from "./AboutUsModal.module.css"
import Button from "../../components/Button/Button"

const AboutUsModal = (props) => {
    const {
        close
    } = props

    const [sp, setSp] = useState(null)

    useEffect(() => {
        if (!sp) {
            setSp(useSPW.spm)
        }
    }, [])

    const openTelegram = useCallback(() => {
        if (!sp) {
            sp.openURL("https://t.me/shadowmonya")
        }
    }, [sp])

    const openYT = useCallback(() => {
        if (!sp) {
            sp.openURL("https://youtube.com/@ShadowMonya")
        }
    }, [sp])

    return (
        <>
            <ModalExitButton modal={close} />
            <i className={`${styles["icon"]} fa-solid fa-rocket`}></i>
            <h1>О проекте Unlucky</h1>

            <p className={styles.desc}>
                <b>Unlucky</b> - Онлайн казино на сервере СПм. Мы предоставляем вам игры, для веселого проведения досуга.

                <br />
                <br />

                Наша цель - дать вам еще один способ развлечься, и при этом
                <br /> возможность пополнить свой капитал.
            </p>

            <div>
                {sp === null ? (
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
                        <LinkButton to="https://t.me/shadowmonya" className={`${styles["btn"]} ${styles["telegram"]}`} target="_blank" >
                            <i className="fab fa-telegram-plane"></i>
                            Telegram
                        </LinkButton>

                        <LinkButton to="https://youtube.com/@ShadowMonya" className={`${styles["btn"]} ${styles["yt"]}`} target="_blank" >
                            <i className="fab fa-youtube"></i>
                            YouTube
                        </LinkButton>
                    </>
                )}
            </div>
        </>
    )
}

export default memo(AboutUsModal)