import TopArtistAlbums from "../AlbumsPageComponents/TopArtistAlbums";
import NavBar from "../HomePageComponents/NavBar";
import RecentlyReviewed from "../AlbumsPageComponents/RecentlyReview";

function AlbumsPage() {
    return (
        <div>
            <NavBar />
            <main>
                <div className="max-w-5xl mx-auto px-4 space-y-8">
                    <TopArtistAlbums />
                    <RecentlyReviewed />
                </div>
            </main>
        </div>
    )
}

export default AlbumsPage;