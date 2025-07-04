import React, { useState } from "react";

type TripFilterProps = {
  countries: string[];
  types: string[];
  selectedFilters: {
    country: string;
    type: string;
    city: string;
    priceMin: number;
    priceMax: number;
    nightsMin: number;
    nightsMax: number;
    rating: number;
  };
  setShowFilter: (value: boolean) => void;
  onFilterChange: (filters: {
    country: string;
    type: string;
    city: string;
    priceMin: number;
    priceMax: number;
    nightsMin: number;
    nightsMax: number;
    rating: number;
  }) => void;
};

const FilterSideBar: React.FC<TripFilterProps> = ({
  countries,
  types,
  selectedFilters,
  setShowFilter,
  onFilterChange,
}) => {
  const [country, setCountry] = useState(selectedFilters.country);
  const [type, setType] = useState(selectedFilters.type);
  const [city, setCity] = useState(selectedFilters.city);
  const [priceMin, setPriceMin] = useState<string>(selectedFilters.priceMin.toString());
  const [priceMax, setPriceMax] = useState<string>(selectedFilters.priceMax.toString());
  const [nightsMin, setNightsMin] = useState<string>(selectedFilters.nightsMin.toString());
  const [nightsMax, setNightsMax] = useState<string>(selectedFilters.nightsMax.toString());
  const [rating, setRating] = useState<string>(selectedFilters.rating.toString());

  const applyFilters = () => {
    setShowFilter(false)
    onFilterChange({ country, type, city, priceMin, priceMax, nightsMin, nightsMax, rating });
  };

  return (
    <div className="mt-[70px] flex flex-col top-0 left-0 w-full sm:w-64 p-4 bg-white shadow-lg sm:h-full overflow-y-auto">

      <div className="flex flex-row justify-between">
        <h2 className="text-lg font-semibold mb-4">Filter Trips</h2>
        <div onClick={() => setShowFilter(false)} className="sm:hidden size-5">
          <img src="/close.png" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Country</label>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full border rounded px-2 py-1">
          <option value="">All</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border rounded px-2 py-1">
          <option value="">All</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">City</label>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full border rounded px-2 py-1" />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Price Range ($)</label>
        <div className="flex gap-2">
          <input
            type="number"
            className="w-1/2 border rounded px-2 py-1"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
          />
          <input
            type="number"
            className="w-1/2 border rounded px-2 py-1"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />

        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Nights Range</label>
        <div className="flex gap-2">
          <input type="number" className="w-1/2 border rounded px-2 py-1" placeholder="Min" value={nightsMin} onChange={(e) => setNightsMin(e.target.value)} />
          <input type="number" className="w-1/2 border rounded px-2 py-1" placeholder="Max" value={nightsMax} onChange={(e) => setNightsMax(e.target.value)} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Min Rating (1-5)</label>
        <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(e.target.value)} className="w-full border rounded px-2 py-1" />
      </div>

      <button
        onClick={applyFilters}
        className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSideBar;
