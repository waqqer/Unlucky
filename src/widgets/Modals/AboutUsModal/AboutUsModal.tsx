import { memo } from "react"
import styles from "./AboutUsModal.module.css"
import SocialButton from "@/Components/Controlls/Buttons/SocialButton"
import { SocialsConfig } from "@/Shared/Configs"

const AboutUs_Modal = () => {
    return (
        <div className={styles.box}>
            <h2 className={styles.title}>О проекте Unlucky</h2>

            <p className={styles.desc}>
                <b>UnLucky</b> - Онлайн казино на сервере СПм.
                Мы предоставляем вам игры, для веселого проведения досуга.

                <br /> <br />

                Наша цель - дать вам еще один способ развлечься, и при этом
                возможность пополнить свой капитал.
            </p>

            <div className={styles.controlls}>
                <div className={styles.btns}>
                    {SocialsConfig.socials.map((v, i) => (
                        <SocialButton
                            key={i}
                            to={v.link}
                            icon={v.icon}
                            name={v.name}
                        >
                            {v.name}
                        </SocialButton>
                    ))}
                </div>

                <p className={styles.policy}>Политика конфиденциальности UnLucky</p>
            </div>
        </div>
    )
}

export default memo(AboutUs_Modal)