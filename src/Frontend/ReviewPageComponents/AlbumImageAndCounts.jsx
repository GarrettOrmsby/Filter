import filters from '../../assets/filter(2).png';
import reviews from '../../assets/menu-3.png';
import likes from '../../assets/heart.png';

function AlbumImageAndCounts({ album }) {
    return (
        <div className="album-header grid grid-rows-2 gap-4 max-w-[250px]">
                    <div className="album-image-container">
                        <div 
                            key={album.id}
                            style={{ backgroundImage: `url(${album.images[0].url})` }}
                            className="
                                relative
                                w-[250px] h-[250px]
                                overflow-hidden
                                bg-cover bg-center
                                shadow-lg
                            "
                        />
                    </div>
                    <div className="album-counters flex gap-4 mx-auto">
                        <div className="album-filters flex gap-1">
                            <img src={filters} alt="filters" className="w-6 h-6" />
                            <p className="text-sm text-gray-400">66k</p>
                        </div>
                        <div className="album-likes flex gap-1">
                            <img src={likes} alt="likes" className="w-6 h-6" />
                            <p className="text-sm text-gray-400">200k</p>
                        </div>
                        <div className="album-reviews flex gap-1">
                            <img src={reviews} alt="reviews" className="w-6 h-6" />
                            <p className="text-sm text-gray-400">100k</p>
                        </div>
                    </div>
                </div>
    )
};

export default AlbumImageAndCounts;
