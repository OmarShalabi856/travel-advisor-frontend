import type { Route } from "+types/root";
import PublishedTrip from "../components/PublishedTrip";
import { useEffect, useState } from "react";
import { getAllTrips } from "../services/backend-api";
import type { Trip } from "../models/Trip";
import FilterSideBar from "../components/FilterSideBar";
import Papa from "papaparse";
import Spinner from "../components/Spinner";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Travel Advisor" },
    { name: "", content: "" },
  ];
}

export default function Home() {
  const [showFilter, setShowFilter] = useState<boolean>(false)
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    country: "",
    type: "",
    city: "",
    priceMin: "",
    priceMax: "",
    nightsMin: "",
    nightsMax: "",
    rating: "",
  });

  useEffect(() => {
    setLoading(true);
    const fetchTrips = async () => {
      const result = await getAllTrips(
        pageNumber,
        20,
        filters.country,
        filters.priceMin,
        filters.priceMax,
        filters.nightsMin,
        filters.nightsMax
      );

      if (result) {
        setTotalCount(result.totalCount);
        setTrips(result.trips)
      }
    }
    fetchTrips();
    setLoading(false);

  }, [pageNumber, filters]);

  useEffect(() => {
    const maxPage = Math.ceil(totalCount / 20) || 1;
    setPageNumber(prev => (prev > maxPage ? 1 : prev));
  }, [totalCount, filters]);


  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    fetch('/Data/allCountries.csv')
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse<string[]>(text, { header: true })
        const countryList = result.data.map((row: any) => row.Country).filter(Boolean)
        setCountries(countryList)
      })
  }, [])

  const totalPages = Math.ceil(totalCount / 20);
 if (loading) return <Spinner />;

  return (
    <div className="flex flex-col sm:flex-row justify-between w-full mx-auto">
      {!showFilter && <button onClick={() => { setShowFilter(true) }} className="sm:hidden  mr-auto text-center rounded-lg">
        <img className="size-12" src={"/filtericon.jpg"}></img>
      </button>}
     <div className={`${showFilter ? "block" : "hidden"} sm:block `}>
        <FilterSideBar
          countries={countries}
          types={["Adventure", "Beach", "Cultural", "Nature", "Luxury"]}
          selectedFilters={filters}
          setShowFilter={setShowFilter}
          onFilterChange={setFilters}
        />
      </div>
      <div className="mt-[70px] w-3/4 flex flex-col justify-start mx-auto">
        <div className="flex flex-row justify-between p-5">
          <div className=" grid sm:grid-cols-2 md:grid-cols-3 gap-10 mt-auto">
            {trips.map((trip, index) => (
              <PublishedTrip
                key={index}
                Id={trip.id}
                country={trip.country}
                imageSrc={trip.imageUrls?.[0]}
                title={trip.title}
                description={trip.description}
                price={trip.price.toString()}
                nights={trip.nights}
              />
            ))}
          </div>

        </div>
        <div className="mx-auto">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .map((number) => (
              <button
                key={number}
                onClick={() => setPageNumber(number)}
                className={`px-4 py-2 rounded ${number === pageNumber ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
              >
                {number}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
