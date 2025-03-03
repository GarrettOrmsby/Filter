import { useState, useEffect } from 'react';

function HeaderImage({ artistImage = null }) {
    const [headerImage, setHeaderImage] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [gradientsVisible, setGradientsVisible] = useState(false);
    const API_BASE_URL = 'http://localhost:3001/api';

    useEffect(() => {
        if (!artistImage) {
            // No image provided, get top artist image
            fetch(`${API_BASE_URL}/top-artists-full`)
                .then(response => response.json())
                .then(data => {
                    // Start fading in gradients immediately
                    setGradientsVisible(true);
                    setHeaderImage(data[0].images[0].url);
                    // Slight delay for image fade-in
                    setTimeout(() => setImageLoaded(true), 100);
                })
                .catch(error => {
                    console.error('Error fetching top artists:', error);
                });
        } else {
            // Use provided artist image
            setGradientsVisible(true);
            setHeaderImage(artistImage);
            setTimeout(() => setImageLoaded(true), 100);
        }
    }, [artistImage]);

    return (
        <div className="w-full h-full relative">
            {headerImage && (
                <>
                    <div 
                        className={`
                            w-full h-full bg-cover bg-center
                            transition-opacity duration-1000 ease-in-out
                            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                        `}
                        style={{
                            backgroundImage: `url(${headerImage})`,
                        }}
                    />
                    <div 
                        className={`
                            absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-backgroundColor
                            transition-opacity duration-700 ease-in-out
                            ${gradientsVisible ? 'opacity-100' : 'opacity-0'}
                        `} 
                    />
                    <div 
                        className={`
                            absolute inset-0
                            transition-opacity duration-700 ease-in-out
                            ${gradientsVisible ? 'opacity-100' : 'opacity-0'}
                        `}
                        style={{
                            background: `linear-gradient(
                                to right,
                                #14181c 0%,
                                transparent 5%,
                                transparent 95%,
                                #14181c 100%
                            )`
                        }}
                    />
                    <div 
                        className={`
                            absolute inset-0
                            transition-opacity duration-700 ease-in-out
                            ${gradientsVisible ? 'opacity-80' : 'opacity-0'}
                        `}
                        style={{
                            background: `linear-gradient(
                                to bottom,
                                #14181c 0%,
                                transparent 25%
                            )`
                        }}
                    />
                </>
            )}
        </div>
    );
}

export default HeaderImage;