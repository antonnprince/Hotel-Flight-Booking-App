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
"https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=DXB&destinationLocationCode=SYD&departureDate=2024-06-22&nonStop=false&adults=1&children=0&infants=0&nonStop=true&max=25&currencyCode=INR",
            {
              headers: {
                'Authorization': `Bearer ${user.token}`,
              }
            }
          );
          setData(res.data.data)
          setDictionary(res.data.dictionaries.carriers)
          console.log(res.data.data)
          console.log(dictionary)
        } catch (error) {
          console.error(error);
        }
      };
    

      const getCarrier=(code)=>{
        if(dictionary)
        {  
          const res = Object.keys(dictionary).find(key=> key===code)
          return dictionary[res]
        }
      }
   
  return (
  <div>
      <button 
      onClick={getResults}
      className='bg-indigo-400 m-8 text-xl p-2 rounded-full'>
          Get Flights
      </button>
      <button onClick={()=>getCarrier("CA")}>
        Carrier
      </button>
      <div className='bg-indigo-500 p-4 rounded-xl flex-col space-y-12 mx-auto'>
        { 
          data&&
              ( 
                  data.map((item,index)=>{
                    let res
                    const obj = item.itineraries[0].segments
                    
                    obj.forEach((item )=>{
                        if(item.arrival.iataCode==="SYD")
                          {
                            res=item.arrival
                          }
                    })

                    const airlines = getCarrier(item.validatingAirlineCodes[0])
                      console.log(airlines)
                    return(         
                          <div className='mx-auto text-xl font-semibold ' key={index}>
                            {index + 1}
                              <div>
                                <h2>{item.itineraries[0].segments[0].departure.at.substring(11).slice(0,-3)}</h2>  
                                <h4> {item.itineraries[0].segments[0].departure.iataCode} </h4>
                              </div>
                              <div>
                              <h2>{res.at.substring(11).slice(0,-3)}</h2>
                                <h4> {res.iataCode} </h4>
                              </div>
                              
                              <h2>Total Duration: {item.itineraries[0].duration.substring(2).toLowerCase()} </h2>
                              <h2>Fare: ₹ {item.price.total.slice(0,-3)}</h2>
                               <h2>{airlines}</h2> 
                          </div>                      
                      )
                    }
                  )
              )
        }
    </div>
  
  </div> 
  )
}

export default Airports
