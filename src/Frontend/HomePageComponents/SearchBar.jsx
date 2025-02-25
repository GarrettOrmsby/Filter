import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        console.log(encodeURIComponent(searchTerm.trim()))
        navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
        setSearchTerm('');
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="relative w-64"  // Fixed width, adjust as needed
        >
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Album..."
                className="
                    w-full
                    px-4
                    py-2
                    rounded-full
                    bg-opacity-20
                    bg-white
                    text-white
                    placeholder-gray-300
                    focus:outline-none
                    focus:ring-2
                    focus:ring-white
                "
            />
            <button 
                type="submit"
                className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-300
                    hover:text-white
                "
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                    <path d="M21 21l-6 -6"></path>
                </svg>
            </button>
        </form>
    );
}

export default SearchBar;