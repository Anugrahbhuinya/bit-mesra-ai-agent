import { useNavigate } from "react-router-dom";

import { useMapStore } from "../../map/store/useMapStore";

interface Props {
  locationName: string;
}

function OpenMapButton({ locationName }: Props) {
  const navigate = useNavigate();

  const setSelectedLocation = useMapStore((state) => state.setSelectedLocation);

  const handleClick = () => {
    setSelectedLocation(locationName);

    navigate("/map");
  };

  return (
    <button
      onClick={handleClick}
      className="
        mt-2
        bg-blue-600
        hover:bg-blue-700
        px-3
        py-2
        rounded-lg
        text-sm
      "
    >
      Open on Map
    </button>
  );
}

export default OpenMapButton;
