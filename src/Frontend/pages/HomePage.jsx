import { useEffect, useState } from "react";
import ArtistCard from "../HomePageComponents/ArtistCard";
import NavBar from "../HomePageComponents/NavBar";
import NewReleases from "../HomePageComponents/NewReleases";
import HeaderImage from "../HomePageComponents/HeaderImage";
import CanDoGrid from "../HomePageComponents/CanDoGrid";

function HomePage() {
    return (
        <div className="min-h-screen relative">  
            
            <div className="absolute top-0 left-0 right-0 h-[675px]">
                <HeaderImage id={null}/>
            </div>

            
            <div className="relative z-10">  
                
                <nav>
                    <NavBar />
                </nav>

                
                <main className="pt-[675px]">  {/* Matches header height */}
                    <div className="max-w-5xl mx-auto px-4 space-y-8">  
                        <h2 className="section-heading text-headingColor">Top Artists</h2>
                        <ArtistCard />
                        <h2 className="section-heading text-headingColor">New Releases</h2>
                        <NewReleases />
                        <h2 className="section-heading text-headingColor">Can Do</h2>
                        <CanDoGrid />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default HomePage;