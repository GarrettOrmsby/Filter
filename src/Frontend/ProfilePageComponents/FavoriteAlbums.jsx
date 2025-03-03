import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { API_BASE_URL } from '../config';

function FavoriteAlbums({ userId }) {
    const [favorites, setFavorites] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Convert both IDs to strings for comparison
    const isOwnProfile = user && user.id.toString() === userId?.toString();
    
    console.log('FavoriteAlbums Debug:', {
        userId,
        currentUserId: user?.id,
        isOwnProfile,
        user
    });

    useEffect(() => {
        fetchFavorites();
    }, [userId]);

    const fetchFavorites = async () => {
        try {
            console.log('Fetching favorites for userId:', userId);
            const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`);
            if (!response.ok) throw new Error('Failed to fetch favorites');
            const data = await response.json();
            console.log('Fetched favorites:', data);
            setFavorites(data);
        } catch (error) {
            console.error('Error fetching favorites:', error);
        }
    };

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`${API_BASE_URL}/search/${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResults(data.albums?.items || []);
        } catch (error) {
            console.error('Error searching albums:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(favorites);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update positions
        const updatedItems = items.map((item, index) => ({
            ...item,
            position: index + 1
        }));

        setFavorites(updatedItems);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': user.id
                },
                body: JSON.stringify({
                    albums: favorites.map((album, index) => ({
                        albumId: album.albumId,
                        position: index + 1
                    }))
                })
            });

            if (!response.ok) throw new Error('Failed to update favorites');
            setIsEditing(false);
            fetchFavorites(); // Refresh the list
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    const handleAddAlbum = (album) => {
        if (favorites.length >= 5) {
            alert('You can only have 5 favorite albums');
            return;
        }

        if (favorites.some(fav => fav.albumId === album.id)) {
            alert('This album is already in your favorites');
            return;
        }

        setFavorites([
            ...favorites,
            {
                albumId: album.id,
                albumName: album.name,
                artistName: album.artists[0].name,
                imageUrl: album.images[0]?.url,
                position: favorites.length + 1
            }
        ]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleRemoveAlbum = (albumId) => {
        setFavorites(favorites.filter(album => album.albumId !== albumId));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="section-heading">Favorite Albums</h2>
                {isOwnProfile && (
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="text-darkTeal hover:text-lightTeal transition-colors"
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                )}
            </div>
            
            {isEditing && (
                <div className="space-y-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        placeholder="Search for albums..."
                        className="w-full p-2 rounded-md bg-white/10 text-white"
                    />
                    
                    {isSearching ? (
                        <p>Searching...</p>
                    ) : searchResults.length > 0 && (
                        <div className="max-h-48 overflow-y-auto bg-white/5 rounded-md">
                            {searchResults.map(album => (
                                <div 
                                    key={album.id}
                                    onClick={() => handleAddAlbum(album)}
                                    className="flex items-center gap-2 p-2 hover:bg-white/10 cursor-pointer"
                                >
                                    <img 
                                        src={album.images[0]?.url} 
                                        alt={album.name}
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-semibold">{album.name}</p>
                                        <p className="text-sm text-gray-400">
                                            {album.artists[0].name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="favorites" direction="horizontal">
                    {(provided) => (
                        <div 
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="grid grid-cols-5 gap-4"
                        >
                            {favorites.map((album, index) => (
                                <Draggable 
                                    key={album.albumId}
                                    draggableId={album.albumId}
                                    index={index}
                                    isDragDisabled={!isEditing}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="relative"
                                        >
                                            <div 
                                                onClick={() => !isEditing && navigate(`/album/${album.albumId}`)}
                                                className="cursor-pointer transition-transform hover:scale-105"
                                            >
                                                <img 
                                                    src={album.imageUrl} 
                                                    alt={album.albumName}
                                                    className="w-full aspect-square object-cover rounded-md"
                                                />
                                                <p className="text-sm font-semibold mt-2">{album.albumName}</p>
                                                <p className="text-xs text-paragraphColor">{album.artistName}</p>
                                            </div>
                                            {isEditing && (
                                                <button
                                                    onClick={() => handleRemoveAlbum(album.albumId)}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center hover:bg-red-600"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default FavoriteAlbums;
