function CanDoCard({ color, icon, description }) {
    return (
        <div className={`
            can-do-card ${color}
            flex items-center justify-start p-4 
            w-[300px] h-[100px]
            rounded-sm shadow-md
        `}>
            <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                    <img 
                        src={icon} 
                        alt={description}
                        className="w-10 h-10"
                    />
                </div>
                <div className="flex-grow">
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}

export default CanDoCard;