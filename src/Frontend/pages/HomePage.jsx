import { useEffect, useState } from "react";
import ArtistCard from "../HomePageComponents/ArtistCard";
import NavBar from "../HomePageComponents/NavBar";
import NewReleases from "../HomePageComponents/NewReleases";
import HeaderImage from "../HomePageComponents/HeaderImage";
import CanDoGrid from "../HomePageComponents/CanDoGrid";
import SpotifyAuthModal from '../components/modals/SpotifyAuthModal/SpotifyAuth';
import PopularReviews from "../HomePageComponents/PopularReviews.jsx";
import { useAuth } from '../context/AuthContext.jsx'

function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    const handleOpenModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };
    return (
        <div className="min-h-screen relative">  
            
            <div className="absolute top-0 left-0 right-0 h-[675px]">
                <HeaderImage id={null}/>
            </div>

            
            <div className="relative z-10">  
                
                <nav>
                    <NavBar />
                </nav>
                
                <main className="pt-[525px]"> 
                    <div className="
                        heading-text 
                        text-center 
                        text-sm 
                        text-headingColor 
                        pb-10 z-10
                        flex flex-col gap-2">
                        <h1>Review the albums you've listened to.</h1>
                        <h1>Keep a diary of your listening journey.</h1>
                        <h1>Focus on the album experience.</h1>
                    </div>
                    <div className="signup-button text-center text-sm text-headingColor pb-10 z-10">
                        <button className="
                            bg-darkTeal 
                            text-headingColor 
                            hover:bg-darkTeal/80 
                            transition-colors 
                            duration-300 
                            px-4 py-2 
                            rounded-md
                            shadow-[0_4px_12px_rgba(0,0,0,0.7)]
                            "
                            onClick={() => handleOpenModal('spotify')}
                            >Get Started!</button>
                    </div>
                    <div className="social-quote text-center text-sm text-paragraphColor pb-10 z-10">
                        <p>"Filtered | The premier Letterboxd&trade; ripoff"</p>
                        <p>- The New York Times</p>
                    </div>
                    <div className="max-w-5xl mx-auto px-4 space-y-8">  
                        <h2 className="section-heading text-headingColor">Top Artists</h2>
                        <ArtistCard />
                        <h2 className="section-heading text-headingColor">New Releases</h2>
                        <NewReleases />
                        <h2 className="section-heading text-headingColor text-center pt-10">Explore Filtered</h2>
                        <CanDoGrid />
                        <h2 className="section-heading text-headingColor">Top Reviews This Week</h2>
                        <PopularReviews />
                    </div>
                </main>
            </div>
            {isModalOpen && modalType === 'spotify' && (
                <SpotifyAuthModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

export default HomePage;