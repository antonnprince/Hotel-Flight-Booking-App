import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'
import flight from './fligt.png'

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
                          <div className='mx-4 text-xl flex flex-row space-x-8 font-semibold text-slate-950 bg-stone-50
                          border-2 border-stone-300 hover:border-stone-500 hover:cursor-pointer shadow-xl
                          my-4 rounded-xl p-4 w-auto '
                           key={index}>
                           
                              <div className='flex flex-col space-y-2'>
                                <img src={flight} className=' w-8 h-8 sm:w-12 sm:h-12  md:w-24 md:h-24'/>
                                <h2 className='m-auto font-semibold text-lg md:text-lg'>{airlines}</h2>
                              </div>


                              <div className='flex flex-row space-x-2 md:space-x-8 my-auto lg:space-x-12'>
                                  <div className='flex flex-col text-2xl '>
                                    <h2 className='font-extrabold text-2xl lg:text-3xl mx-auto '>{item.itineraries[0].segments[0].departure.at.substring(11).slice(0,-3)}</h2>  
                                    <h4 className='text-lg lg:text-xl mx-auto'>{item.itineraries[0].segments[0].departure.iataCode} </h4>
                                  </div>
                                  <h2 className='text-lg lg:text-lg font-normal mt-20'>{item.itineraries[0].duration.substring(2).toLowerCase()} </h2>
                                  <div className=' flex flex-col mx-auto'>
                                    <h2 className='font-extrabold text-2xl lg:text-3xl'>{res.at.substring(11).slice(0,-3)}</h2>
                                    <h4 className='text-lg lg:text-xl mx-auto'>{res.iataCode} </h4>
                                  </div>
                              </div>

                              <div className='flex flex-col my-auto'>
                                <h2 className='text-2xl lg:text-4xl '>₹{item.price.total.slice(0,-3)}</h2>
                                <h2 className='font-normal text-lg mx-auto'>Per person</h2>
                              </div>   
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
