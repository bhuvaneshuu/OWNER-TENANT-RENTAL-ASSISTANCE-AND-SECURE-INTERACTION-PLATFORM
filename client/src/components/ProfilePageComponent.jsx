import { useCallback, useState } from "react";
import {
    UserProfileComponent,
} from ".";
import ImageViewer from "react-simple-image-viewer";

const ProfilePageComponent = ({ user, handleSubmit, isProcessing }) => {

    // toggle open and close of ImageViewer
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    // open the ImageViewer and set the currentImageIndex to the index of the image that was clicked
    const openImageViewer = useCallback((index) => {
        setIsViewerOpen(true);
    }, []);

    // close the ImageViewer
    const closeImageViewer = () => {
        setIsViewerOpen(false);
    };
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-12 flex items-center justify-center animate-fadein-scale">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border border-indigo-100 p-8 flex flex-col items-center gap-8 animate-fadein-scale">
                {/* Profile Picture at the top */}
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden shadow-xl border-4 border-blue-200 bg-white -mt-20 mb-2">
                    <img
                        className="w-full h-full object-cover"
                        src={user?.profileImage}
                        alt="profile"
                        onClick={() => openImageViewer(0)}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                {isViewerOpen && (
                    <ImageViewer
                        src={[user?.profileImage]}
                        currentIndex={0}
                        onClose={closeImageViewer}
                        disableScroll={false}
                        backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.9)", zIndex: 9999 }}
                        closeOnClickOutside={true}
                    />
                )}
                <h2 className="text-3xl font-extrabold text-[#223981] text-center drop-shadow-lg animate-fadein-delay">
                    {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-[#475569] text-center text-lg mb-2">{user?.address}, {user?.city}, {user?.country}</p>
                {/* Profile Form Card below info */}
                <div className="w-full">
                    <form id="form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <UserProfileComponent {...user} isProcessing={isProcessing} />
                    </form>
                </div>
            </div>
        </main>
    )
}

export default ProfilePageComponent