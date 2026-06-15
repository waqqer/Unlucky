import Separator from "@/Components/Decorations/Separator"
import { memo } from "react"
import styles from "./ProfileModal.module.css"
import Head from "@/Components/Decorations/Head"
import Username from "@/Components/Info/Username"
import UserID from "@/Components/Info/UserID"
import Balance from "@/Components/Info/Balance"
import Button from "@/Components/Controlls/Buttons/Button"
import { Tooltip } from "react-tooltip"

const ProfileModal = () => {
    return (
        <>
            <div className={styles.content}>
                <h2>Профиль</h2>

                <div className={styles.user}>
                    <Head size={52} />

                    <div className={styles.info}>
                        <Username withBadge withFire />
                        <UserID />
                    </div>
                </div>

                <Separator size={100} />

                <div className={styles.balance}>
                    <div className={styles.data}>
                        <h4>Баланс: </h4>
                        <Balance className={styles["balance-label"]} />
                    </div>

                    <div className={styles.btns}>
                        <Button className={styles.btn} id="deposit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M31 169C21.6 159.6 21.6 144.4 31 135.1L103 63C112.4 53.6 127.6 53.6 136.9 63C146.2 72.4 146.3 87.6 136.9 96.9L105.9 127.9L173.6 127.9L173.6 127.9L511.9 127.9C547.2 127.9 575.9 156.6 575.9 191.9L575.9 370.1L570.8 365C542.7 336.9 497.1 336.9 469 365C441.8 392.2 440.9 435.6 466.2 463.9L533.9 463.9L502.9 432.9C493.5 423.5 493.5 408.3 502.9 399C512.3 389.7 527.5 389.6 536.8 399L608.8 471C618.2 480.4 618.2 495.6 608.8 504.9L536.8 576.9C527.4 586.3 512.2 586.3 502.9 576.9C493.6 567.5 493.5 552.3 502.9 543L533.9 512L127.8 512C92.5 512 63.8 483.3 63.8 448L63.8 269.8L68.9 274.9C97 303 142.6 303 170.7 274.9C197.9 247.7 198.8 204.3 173.5 176L105.8 176L136.8 207C146.2 216.4 146.2 231.6 136.8 240.9C127.4 250.2 112.2 250.3 102.9 240.9L31 169zM416 320C416 267 373 224 320 224C267 224 224 267 224 320C224 373 267 416 320 416C373 416 416 373 416 320zM504 255.5C508.4 256 512 252.4 512 248L512 200C512 195.6 508.4 192 504 192L456 192C451.6 192 447.9 195.6 448.5 200C452.1 229 475.1 251.9 504 255.5zM136 384.5C131.6 384 128 387.6 128 392L128 440C128 444.4 131.6 448 136 448L184 448C188.4 448 192.1 444.4 191.5 440C187.9 411 164.9 388.1 136 384.5z" />
                            </svg>
                        </Button>
                        <Button className={styles.btn} id="cashout">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path d="M64 173.5L64 483.6C64 503 75.8 520.9 94.3 526.9C188.3 556.9 253.1 535.3 317.6 513.8C380 493 442 472.3 529.7 498.5C551.9 505.1 575.9 489.7 575.9 466.5L575.9 156.4C575.9 137 564.1 119.1 545.6 113.1C451.6 83.1 386.8 104.7 322.3 126.2C259.9 147 197.9 167.7 110.2 141.5C88 134.9 63.9 150.3 63.9 173.5zM320 432C267 432 224 381.9 224 320C224 258.1 267 208 320 208C373 208 416 258.1 416 320C416 381.9 373 432 320 432zM191.1 469.5C191.8 473.9 188.3 477.6 183.9 477.6C168.2 477.6 151.8 475.8 133.9 471.5C130.4 470.7 127.9 467.5 127.9 463.8L128 424C128 419.6 131.6 415.9 136 416.5C164.1 420 186.6 441.7 191.2 469.5zM512 418.6C512 423.6 507.4 427.4 502.5 426.6C487.1 424.1 472.3 422.7 458.1 422.3C453.2 422.2 449.4 417.8 450.9 413.1C458.2 389.4 478.9 371.7 504.1 368.5C508.5 368 512.1 371.6 512.1 376L512.1 418.6zM504 223.5C475.9 220 453.4 198.3 448.8 170.5C448.1 166.1 451.6 162.4 456 162.4C471.7 162.4 488.1 164.2 506 168.5C509.5 169.3 512 172.5 512 176.2L512 216.1C512 220.5 508.4 224.2 504 223.6zM181.9 217.7C186.8 217.8 190.6 222.2 189.1 226.9C181.8 250.6 161.1 268.3 135.9 271.5C131.5 272 127.9 268.4 127.9 264L127.9 221.4C127.9 216.4 132.5 212.6 137.4 213.4C152.8 215.9 167.6 217.3 181.8 217.7zM304 252C293 252 284 261 284 272C284 281.7 290.9 289.7 300 291.6L300 340L296 340C285 340 276 349 276 360C276 371 285 380 296 380L344 380C355 380 364 371 364 360C364 349 355 340 344 340L340 340L340 272C340 261 331 252 320 252L304 252z" />
                            </svg>
                        </Button>
                    </div>
                </div>

                <div className={styles.history}>
                    <p className={styles["history-notfound"]}>Тут ничего нет(...</p>
                </div>
            </div>

            <Tooltip
                anchorSelect="#deposit"
                delayShow={300}
                content="Пополнение средств"
                variant="info"
            />

            <Tooltip
                anchorSelect="#cashout"
                delayShow={300}
                content="Вывод средств"
                variant="info"
            />
        </>
    )
}

export default memo(ProfileModal)