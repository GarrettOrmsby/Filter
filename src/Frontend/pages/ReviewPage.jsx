import { useParams } from 'react-router-dom';
import NavBar from '../HomePageComponents/NavBar';
import { useEffect, useState } from 'react';

function ReviewPage() {
    const { id } = useParams();
    
    

    return (
        <div>
            <NavBar />
            <h1>Review Page</h1>
            <p>Album ID: {id}</p>
        </div>
    );
}

export default ReviewPage;
