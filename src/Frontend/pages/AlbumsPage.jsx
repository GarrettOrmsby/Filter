import TopArtistAlbums from "../AlbumsPageComponents/TopArtistAlbums";
import NavBar from "../HomePageComponents/NavBar";
import RecentlyReviewed from "../AlbumsPageComponents/RecentlyReview";

function AlbumsPage() {
    return (
        <div>
            <NavBar />
            <TopArtistAlbums />
            <RecentlyReviewed />
        </div>
    )
}

export default AlbumsPage;