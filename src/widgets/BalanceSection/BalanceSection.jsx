import Button from "@/components/Button"
import "./BalanceSection.css"

const BalanceSection = (props) => {
    const {
        balance=0,
        className
    } = props

    return (
        <div className={`balance-section ${className}`}>
            <p>Баланс: <span>{balance}</span></p>

            <Button className="add-money-button">
                <i className="fa-solid fa-circle-plus"></i>
                Пополнить
            </Button>
        </div>
    )
}

export default BalanceSection