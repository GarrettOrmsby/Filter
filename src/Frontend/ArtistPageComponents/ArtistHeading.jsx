

function ArtistHeading( { name } ) {
    return (
        <div className="artist-heading">
            <h1 className="text-headingColor">Albums by</h1>
            <h1 className="section-heading text-darkTeal">{name}</h1>
        </div>
    );
}

export default ArtistHeading;