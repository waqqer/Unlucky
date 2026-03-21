import GameCard from "../GameCard"

import SlotsImage from "@/shared/images/slots.png"
import MinerImage from "@/shared/images/miner.png"

import "./GamesList.css"

const GamesList = () => {
    
    return (
        <div className="games-list">
            <GameCard 
                title="Слоты" 
                desc="Выбей ряд одинаковых предметов и получай ИКСЫ!" 
                image={SlotsImage}
                link="/slots"
            />
            <GameCard 
                title="Майнер" 
                desc="От твоей удачи зависит кирка, которая поможет добраться до лута!" 
                image={MinerImage} 
                link="/miner"
            />
            <GameCard 
                title="ХЗ" 
                desc="?????????? ????????? ????????" 
            />
        </div>
    )
}

export default GamesList