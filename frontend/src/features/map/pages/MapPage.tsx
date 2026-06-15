import CampusMap from "../components/CampusMap";

function MapPage() {
  return (
    <div className="p-6 h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-4">Campus Map</h1>

      <div className="flex-1 rounded-xl overflow-hidden border border-zinc-800">
        <CampusMap />
      </div>
    </div>
  );
}

export default MapPage;
