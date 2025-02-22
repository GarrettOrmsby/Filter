import { useState, useEffect } from 'react';

function HeaderImage({ artistImage = null }) {
    const [headerImage, setHeaderImage] = useState(null);
    const API_BASE_URL = 'http://localhost:3001/api';

    useEffect(() => {
        if (!artistImage) {
            // No image provided, get top artist image
            fetch(`${API_BASE_URL}/top-artists-full`)
                .then(response => response.json())
                .then(data => {
                    setHeaderImage(data[0].images[0].url);
                })
                .catch(error => {
                    console.error('Error fetching top artists:', error);
                });
        } else {
            // Use provided artist image
            setHeaderImage(artistImage);
        }
    }, [artistImage]);

    return (
        <div className="w-full h-full relative">
            {headerImage && (
                <>
                    <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${headerImage})`,
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-backgroundColor opacity-100" />
                    <div 
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(
                                to right,
                                #14181c 0%,
                                transparent 5%,
                                transparent 95%,
                                #14181c 100%
                            )`,
                            opacity: 1
                        }}
                    />
                    <div 
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(
                                to bottom,
                                #14181c 0%,
                                transparent 25%
                            )`,
                            opacity: 0.8
                        }}
                    />
                </>
            )}
        </div>
    );
}

export default HeaderImage;