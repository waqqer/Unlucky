import { memo } from "react"
import styles from "./AboutUsModal.module.css"
import Separator from "@/Components/Decorations/Separator"
import SocialButton from "@/Components/Controlls/Buttons/SocialButton/SocialButton"

const AboutUsModal = () => {
    return (
        <div className={styles.content}>
            <h2>О нас</h2>
            <Separator />
            <p className={styles.desc}>
                <b>UnLucky</b> - Онлайн казино на сервере СПм.
                Мы предоставляем вам игры, для веселого проведения досуга.

                <br /> <br />

                Наша цель - дать вам еще один способ развлечься, и при этом
                возможность пополнить свой капитал.
            </p>

            <div className={styles.info}>
                <div className={styles.btns}>
                    <SocialButton social="telegram" link={"https://t.me/shadowmonya"} sound>
                        Telegram
                    </SocialButton>

                    <SocialButton social="youtube" link={"https://youtube.com/@ShadowMonya"} sound>
                        Youtube
                    </SocialButton>
                </div>

                <p className={styles.policy}>Политика конфиденциальности UnLucky</p>
            </div>
        </div>
    )
}

export default memo(AboutUsModal)