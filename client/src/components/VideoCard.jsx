import { useSelector, useDispatch } from "react-redux";
import { setVideo } from "../features/videoSlice";
import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div
      className="rounded-lg overflow-hidden shadow-md bg-background-light dark:bg-background-dark border border-secondary-light dark:border-secondary-dark transition-transform duration-300 hover:scale-105 hover:shadow-xl"
      onClick={() => {
        dispatch(setVideo({ video: video }))
        navigate('/video');
      }}
    >
      <img
        src={video?.thumbnail}
        alt={video?.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-light dark:text-primary-dark truncate">
          {video?.title}
        </h3>
        <p className="text-sm text-secondary-light dark:text-secondary-dark">{video?.ownerDetails?.fullname}</p>
      </div>
    </div>
  );
}
