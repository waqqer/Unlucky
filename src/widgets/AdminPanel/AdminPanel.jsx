import Container from "@/Components/Container"
import AdminInfoItem from "@/components/AdminInfoItem"
import AdminInfoBlock from "@/components/AdminInfoBlock/AdminInfoBlock"
import styles from "./AdminPanel.module.css"

const AdminPanel = () => {
    return (
        <Container className={styles["admin-box"]}>
            <div className={styles["admin-panel"]}>
                <AdminInfoItem className={styles.big}>
                    <h3> Статистика по онлайну </h3>

                    <div className={styles.container}>
                        <AdminInfoBlock>
                            <i className="fa-solid fa-signal mobile-hide"></i>

                            <div className={styles.desc}>
                                <h3>100</h3>
                                <p>Клиентов онлайн</p>
                            </div>
                        </AdminInfoBlock>

                        <AdminInfoBlock>
                            <i className="fa-solid fa-ghost mobile-hide"></i>

                            <div className={styles.desc}>
                                <h3>100</h3>
                                <p>Уникальных посетителей</p>
                            </div>
                        </AdminInfoBlock>

                        <AdminInfoBlock>
                            <i className="fa-solid fa-satellite mobile-hide"></i>

                            <div className={styles.desc}>
                                <h3>100</h3>
                                <p>Макс. кол-во посетителей одновременно</p>
                            </div>
                        </AdminInfoBlock>
                    </div>
                </AdminInfoItem>

                <AdminInfoItem>
                    <h3> Статистика по арам </h3>

                    <div className={styles.container}>
                        <AdminInfoBlock>
                            <i className="fa-solid fa-coins mobile-hide"></i>

                            <div className={styles.desc}>
                                <h3 style={{ color: "rgb(173, 255, 148)" }}>
                                    100 000
                                </h3>
                                <p>Аров выиграно</p>
                            </div>
                        </AdminInfoBlock>

                        <AdminInfoBlock>
                            <i className="fa-solid fa-wallet mobile-hide"></i>

                            <div className={styles.desc}>
                                <h3>250 000</h3>
                                <p>Всего аров</p>
                            </div>
                        </AdminInfoBlock>

                        <AdminInfoBlock>
                            <i className="fa-solid fa-arrow-trend-down mobile-hide"></i>

                            <div className={styles.desc}>
                                <h3 style={{ color: "rgb(255, 148, 148)" }}>
                                    50 000
                                </h3>
                                <p>Всего аров проиграно</p>
                            </div>
                        </AdminInfoBlock>
                    </div>
                </AdminInfoItem>

                <AdminInfoItem className="mobile-hide">
                    <h3> Статистика по играм </h3>

                    <div className={styles.container}>
                        <AdminInfoBlock>
                            <i className="fa-solid fa-dice-d6 mobile-hide"></i>

                            <div className={styles.desc}>
                                <h3>Название игры</h3>
                                <p>Всего игр: <b>123</b></p>
                            </div>
                        </AdminInfoBlock>

                        <AdminInfoBlock>
                            <i className="fa-solid fa-dice-d6 mobile-hide"></i>

                            <div className={styles.desc}>
                                <h3>Название игры</h3>
                                <p>Всего игр: <b>123</b></p>
                            </div>
                        </AdminInfoBlock>

                        <AdminInfoBlock>
                            <i className="fa-solid fa-dice-d6 mobile-hide"></i>

                            <div className={styles.desc}>
                                <h3>Название игры</h3>
                                <p>Всего игр: <b>123</b></p>
                            </div>
                        </AdminInfoBlock>
                    </div>
                </AdminInfoItem>
            </div>
        </Container>
    )
}

export default AdminPanel