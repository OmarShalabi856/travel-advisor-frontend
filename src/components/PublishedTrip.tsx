import { useNavigate } from "react-router"


type PublishedTripProps = {
  Id: number
  imageSrc: string
  title: string
  description: string
  price: string
  country: string
  nights: number
}

const PublishedTrip: React.FC<PublishedTripProps> = ({
  Id,
  imageSrc,
  title,
  description,
  price,
  country,
  nights
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col bg-white  rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img className=" w-full object-cover" src={imageSrc} alt="" />
      <div className="p-4 flex flex-col flex-grow justify-between">
        <span className="text-xs text-gray-500 uppercase">{country}</span>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p
          className="text-sm text-gray-600 mb-4"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </p>

        <span className="line-clamp-1 text-sm font-semibold text-black-600 mt-auto">${price} / {nights} Nights</span>
        <button onClick={() => (navigate(`/trip-details/${Id}`))} className="mt-auto bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          View Details
        </button>

       
      </div>
    </div>
  )
}

export default PublishedTrip
