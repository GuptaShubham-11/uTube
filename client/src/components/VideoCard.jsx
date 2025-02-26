import { useSelector, useDispatch } from 'react-redux';
import { setVideo } from '../features/videoSlice';
import { useNavigate } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';

export default function VideoCard({ video }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div
      className="rounded-lg overflow-hidden shadow-md bg-background-light dark:bg-background-dark 
                 border border-secondary-light dark:border-secondary-dark transition-all duration-300 
                 hover:scale-105 hover:shadow-xl cursor-pointer relative group"
      onClick={() => {
        dispatch(setVideo({ video }));
        navigate('/video');
      }}
    >
      {/* Thumbnail Section */}
      <div className="relative">
        <img src={video?.thumbnail} alt={video?.title} className="w-full h-48 object-cover" />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <PlayCircle size={48} className="text-white" />
        </div>
      </div>

      {/* Video Info Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark truncate">
          {video?.title}
        </h3>
        <p className="text-sm text-secondary-light dark:text-secondary-dark">
          {video?.ownerDetails?.fullname}
        </p>
      </div>
    </div>
  );
}
