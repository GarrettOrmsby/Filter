import TopArtistAlbums from "../AlbumsPageComponents/TopArtistAlbums";
import NavBar from "../HomePageComponents/NavBar";
import RecentlyReviewed from "../AlbumsPageComponents/RecentlyReview";
import contentBg from '../../assets/content-bg.4284ab72.png';

function AlbumsPage() {
    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4">
                <NavBar />
            </div>
            <main style={{
                    background: `#14181c url(${contentBg}) 0 -1px repeat-x`,
                    width: '100vw'
                }}
                className="min-h-screen"
            >
                <div className="max-w-5xl mx-auto px-4 space-y-8">
                    <TopArtistAlbums />
                    <RecentlyReviewed />
                </div>
            </main>
        </div>
    )
}

export default AlbumsPage;