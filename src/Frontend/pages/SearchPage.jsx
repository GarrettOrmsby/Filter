import { useParams } from "react-router-dom"
import NavBar from '../HomePageComponents/NavBar';
import contentBg from '../../assets/content-bg.4284ab72.png';
import { useEffect, useState } from "react";
import SearchResults from '../SearchPageComponents/SearchResults';

const API_BASE_URL = 'http://localhost:3001/api';

function SearchPage() {
    const { query } = useParams();
    const [searchResults, setSearchResults] = useState();
    
    useEffect(() => {
        fetch(`${API_BASE_URL}/search/${query}`)
            .then(response => response.json())
            .then(data => setSearchResults(data))
            .catch(error => console.error('Error:', error));
    }, [query]);

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4">
                <NavBar />
            </div>
            <main style={{
                background: `#14181c url(${contentBg}) 0 -1px repeat-x`,
                width: '100vw'
            }}>
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-2xl text-white mb-6">Results for "{query}"</h1>
                    <SearchResults results={searchResults} />
                </div>
            </main>
        </div>
    );
}

export default SearchPage