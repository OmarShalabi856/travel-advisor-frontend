import React, { useEffect, useState } from 'react';
import { getUserTrips } from '../services/backend-api';
import type { UpdateTrip } from '../models/UpdateTrip';
import MyTrip from '../components/MyTrip';



const MyTrips = () => {
  const [myTrips, setMyTrips] = useState<UpdateTrip[]>([]);
  const [loading, setLoading]=useState<boolean>();

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const trips = await getUserTrips();
      console.log(trips)
      setMyTrips(trips);
    };
    fetchData();
    setLoading(false)
  }, []);

  return (
    <div className="mt-[70px] grid sm:grid-cols-2 md:grid-cols-3 gap-10">
      {myTrips.map((trip) => (
        <MyTrip
          key={trip.id}
          trip={trip}
        />

      ))}
    </div>
  );
};

export default MyTrips;
