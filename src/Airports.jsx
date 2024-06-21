import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'

const Airports = () => {

    const auth = useAuth()
    const user = auth.user
    console.log(user)
    const [data,setData]=useState()
    const [dictionary, setDictionary] =useState()

    const getResults = async () => 
    {
        try {
          const res = await axios.get(
"https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=DXB&destinationLocationCode=BLR&departureDate=2024-06-22&nonStop=false&adults=1&children=0&infants=0&nonStop=true&max=25&currencyCode=INR",
            {
              headers: {
                'Authorization': `Bearer ${user.token}`,
              }
            }
          );
          setData(res.data.data)
          setDictionary(res.data.dictionaries.carriers)
          console.log(res.data.data)
          console.log(res.data.dictionaries.carriers)
        } 
        catch (error) 
        {
          console.error(error);
        }
      };
    

      const getCarrier=(code)=>{
          const res = Object.keys(dictionary).find(key=> key===code)
          return dictionary[res]
      }
   
  return (
  <div>
      <button 
      onClick={getResults}
      className='bg-indigo-400 m-8 text-xl p-2 rounded-full'>
          Get Flights
      </button>
      
        { 
          data&&
              ( 
                  data.map((item,index)=>{
                    let res
                    const obj = item.itineraries[0].segments
                    obj.forEach((item )=>{
                        if(item.arrival.iataCode==="BLR")
                          {
                            res=item.arrival
                          }
                    })
                    const airlines = getCarrier(item.validatingAirlineCodes[0])
                    return(         
                          <div className='mx-4 text-xl flex flex-row space-x-8 font-semibold text-white bg-neutral-500 my-4 rounded-xl p-4 '
                           key={index}>
                            <h2 className='my-auto'>{airlines}</h2>
                              <div className='flex flex-col my-2'>
                                <h2 className='mr-24'>{item.itineraries[0].segments[0].departure.at.substring(11).slice(0,-3)}</h2>  
                                <h4 className='mr-24'>{item.itineraries[0].segments[0].departure.iataCode} </h4>
                                <h2 className='text-right'>{item.itineraries[0].duration.substring(2).toLowerCase()} </h2>
                              </div>
                              
                              <div className='flex flex-col my-2'>
                                <h2 >{res.at.substring(11).slice(0,-3)}</h2>
                                <h4 >{res.iataCode} </h4>
                              </div>
                                <h2 className='text-3xl my-auto'>₹{item.price.total.slice(0,-3)}</h2>
                               
                          </div>                      
                      )
                    }
                  )
              )
        }
    </div>
  
  )
}

export default Airports
