import Title from "@/components/Title"

import "./MainTitle.css"

const MainTitle = () => {

    return (
        <section className="container">
            <Title className="main-title">
                <h1 className="title">
                    <span>Un</span>
                    <span className="purple-part">lucky</span>
                </h1>
                <p className="desc">
                    Онлайн казино на сервере СПм для поддержки казны и спонсирования Коробки..
                </p>
            </Title>
        </section>
    )
}

export default MainTitle