const HEADER_IMAGE = 'https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58';

function HeaderImage() {
    return (
        <div className="w-full h-full relative">
            <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                    backgroundImage: `url(${HEADER_IMAGE})`,
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#201b2b] opacity-100" />
            <div 
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(
                        to right,
                        #201b2b 0%,
                        transparent 5%,
                        transparent 95%,
                        #201b2b 100%
                    )`,
                    opacity: 1
                }}
            />
            <div 
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(
                        to bottom,
                        rgba(32, 27, 43, 0.7) 0%,
                        transparent 25%
                    )`,
                    opacity: 0.8
                }}
            />
        </div>
    );
}

export default HeaderImage;