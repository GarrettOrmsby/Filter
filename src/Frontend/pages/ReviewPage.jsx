import { useParams } from 'react-router-dom';

function ReviewPage() {
    const { id } = useParams();
    
    console.log('Album ID:', id); // Debug log

    return (
        <div>
            <h1>Review Page</h1>
            <p>Album ID: {id}</p>
        </div>
    );
}

export default ReviewPage;
