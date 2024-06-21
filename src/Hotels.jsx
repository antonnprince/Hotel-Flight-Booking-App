import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'
import room from "./room.jpg"


const Hotels = () => {

const API_KEY="470f24fdfaa0e1078cc6433c8eafde5ba8767b81e09fd35146acae47ac238988"
const auth=useAuth()
const user = auth.user

const [hotels, setHotels] = useState()

const getHotels=async()=>
{
    const res = await axios.get("https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=COK&radius=25&radiusUnit=KM&amenities=SWIMMING_POOL,SPA,FITNESS_CENTER,AIR_CONDITIONING,CASINO,JACUZZI,MASSAGE,BAR,MINIBAR&hotelSource=ALL",
        {
            headers:{
                'Authorization': `Bearer ${user.token}`,
            }
        }
    )
    console.log(res.data)
    setHotels(res.data.data)
}   

function getRandom(){
    return Math.floor(Math.random()*5)+1
}

function getPrice(){
    return Math.floor(Math.random()*5000)
}

function getWord(word) {

     // Replace underscores with spaces and convert the word to lowercase with the first letter in uppercase
    let formattedWord = word.replace(/_/g, ' ').toLowerCase();
    return formattedWord.charAt(0).toUpperCase() + formattedWord.slice(1);
  }
  
    return (
    <div className='mx-auto'>
        <button onClick={getHotels}>
            Hotels
        </button>
        
        {   hotels? 
             (
                hotels.map((hotel,index)=>{
                    const rating = getRandom()
                    const price = getPrice()
                return(
                        <div key={index} className='bg-neutral-400 mx-auto p-4 flex flex-col h-fit rounded-xl my-4'>
                            
                            <img src={room} className='w-1/3 h-1/2'/>
                            
                            <div className=''>
                                <h2 className='mx-6 font-bold text-xl'>{hotel.name}</h2>
                            </div>
                            
                            <div className=''>
                                {
                                    hotel.amenities.map((item,index)=>
                                        {   
                                            const res = getWord(item)
                                            return(
                                            <h2 key={index}>{res}</h2>
                                            )
                                        })
                                }
                            </div>
                            
                            <h2>₹{price} Per Night</h2>
                            {
                                  Array(rating).fill().map((_, i)=>
                                (
                                    <span key={i}>⭐</span>
                                ))
                            }
                        </div>
                    )
                })
            ):<span class="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-sky-400 "></span>
        }
    </div>
  )
}

export default Hotels


