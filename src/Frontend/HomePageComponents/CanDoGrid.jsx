import CanDoCard from './CanDoCard';
import spotify from '../../assets/brand-spotify.png';
import filter from '../../assets/filter.png';
import notebook from '../../assets/notebook.png';
import pencil from '../../assets/pencil.png';
import playlist from '../../assets/playlist.png';
import star from '../../assets/star-half.png';


function CanDoGrid() {
    const cards = [
        {color: "bg-darkTeal hover:bg-gradient-to-b from-[#2d8a7d] to-[#7dcdc1]", icon: star, description: "Rate each album"},
        {color: "bg-darkTeal hover:bg-gradient-to-b from-[#2d8a7d] to-[#7dcdc1]", icon: pencil, description: "Write, share, and read reviews about each album"},
        {color: "bg-darkTeal hover:bg-gradient-to-b from-[#2d8a7d] to-[#7dcdc1]", icon: filter, description: "Create your own Filtered collections"},
        {color: "bg-lightTeal hover:bg-gradient-to-b from-[#7dcdc1] to-[#2d8a7d]", icon: playlist, description: "Display your presonal tastes and music exploration"},
        {color: "bg-lightTeal hover:bg-gradient-to-b from-[#7dcdc1] to-[#2d8a7d]", icon: notebook, description: "Create entries in your diary to record your own "},
        {color: "bg-lightTeal hover:bg-gradient-to-b from-[#7dcdc1] to-[#2d8a7d]", icon: spotify, description: "See personlized stats for your music"},

    ]


    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {cards.map((card, index) => (
                <CanDoCard 
                    key={index}
                    color={card.color}
                    icon={card.icon}
                    description={card.description}
                />

            ))}
        </div>
    );
}

export default CanDoGrid;