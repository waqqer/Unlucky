import LinkButton from "@/components/LinkButton"

import "./GameCard.css"

const GameCard = (props) => {
    const {
        link,
        title,
        desc,
        image
    } = props

    return (
        <div style={{backgroundImage: `url(${image})`}} className="game-card">
            <div className="details">
                <h3 className="title">{title}</h3>

                <div className="game-desc">
                    <p className="desc">{desc}</p>
                    <LinkButton className="play-game-button" to={link}> Играть </LinkButton>
                </div>
            </div>
        </div>
    )
}

export default GameCard