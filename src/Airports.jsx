import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const Airports = () => {

    const auth = useAuth()
    const user = auth.user
    console.log(user)
    
    useEffect(()=>{
       
    },[])
        
    const getResults = async () => {
        try {
          const res = await axios.get(
            "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=SYD&destinationLocationCode=BKK&departureDate=2024-06-22&adults=1&nonStop=false&max=250",
            {
              headers: {
                'Authorization': `Bearer ${user.token}`,
              }
            }
          );
      
          console.log(res.data);
        } catch (error) {
          console.error(error);
        }
      };
      

  return (
    <div>
        <button 
        onClick={getResults}
        className='bg-indigo-400 m-8 text-xl p-2 rounded-full'>
            Get Flights
        </button>
    </div>
  )
}

export default Airports