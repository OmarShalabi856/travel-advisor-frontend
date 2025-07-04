import { Link, useNavigate } from "react-router"
import { toast } from "react-toastify"
import type { UpdateTrip } from "~/models/UpdateTrip"
import { deleteTrip } from "../services/backend-api"




const MyTrip: React.FC<{ trip: UpdateTrip }> = ({ trip }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white flex flex-col rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mt-10 mx-3">
            <img className="h-1/2  max-h-[200px] full object-cover" src={trip.imageUrls?.[0] ?? ""} alt="" />
            <div className=" p-4 flex flex-col justify-between ">
                <span className="text-xs text-gray-500 uppercase">{trip.country}</span>
                <h3 className="text-lg font-semibold text-gray-800">{trip.title}</h3>
                <p className="text-sm text-gray-600">{trip.description}</p>
                <span className="text-sm font-semibold text-black-600 mt-auto">${trip.price} / {trip.nights} Nights</span>
                <span className="text-sm font-semibold text-black-600 mt-auto">${trip.id} Nights</span>
                <Link to={`/update-trip/${trip.id}`} className="text-center bg-green-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Update
                </Link>
                <button onClick={async () => {
                    const confirmed = window.confirm("Are you sure you want to delete this trip?");
                    if (confirmed) {
                        await deleteTrip(trip.id)
                        toast.success("Trip deleted successfully!");
                        setTimeout(() =>navigate(0) , 2000);
                    }
                }} className="mt-2 bg-red-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-delete-700 transition-colors">
                    Delete
                </button>
            </div>
        </div>
    )
}

export default MyTrip
