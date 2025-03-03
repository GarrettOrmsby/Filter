function ProfileHeader({ user, reviewCount }) {
    return (
        <div className="flex items-center gap-6 bg-white/5 p-6 rounded-lg">
            <div className="w-24 h-24">
                <img 
                    src={user.profileImageUrl || '/default-avatar.png'} 
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                />
            </div>
            <div>
                <h1 className="text-2xl font-bold">{user.displayName}</h1>
                <p className="text-paragraphColor">
                    {reviewCount} {reviewCount === 1 ? 'album' : 'albums'} reviewed
                </p>
            </div>
        </div>
    );
}

export default ProfileHeader;
