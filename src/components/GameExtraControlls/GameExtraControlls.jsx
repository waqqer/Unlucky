import Button from "@/components/Button"
import LinkButton from "@/components/LinkButton"
import styles from "./GameExtraControlls.module.css"

const GameExtraControlls = (props) => {
    const {
        aboutOpen,
        children
    } = props

    return (
        <div className={`${styles["misc-container"]} mobile-hide`}>
            <LinkButton>На главную</LinkButton>
            {children}
            <Button onClick={aboutOpen}>?</Button>
        </div>
    )

}

export default GameExtraControlls