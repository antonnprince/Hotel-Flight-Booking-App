import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'
const Hotels = () => {

const API_KEY="470f24fdfaa0e1078cc6433c8eafde5ba8767b81e09fd35146acae47ac238988"
const auth=useAuth()
const user = auth.user

const [hotels, setHotels] = useState()

const getHotels=async()=>
{
    const res = await axios.get("https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=COK&radius=25&radiusUnit=KM&amenities=SWIMMING_POOL,SPA,FITNESS_CENTER,CASINO,JACUZZI,MASSAGE,VALET_PARKING,BAR,MINIBAR,ROOM_SERVICE&hotelSource=ALL",
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
    return (
    <div>
        <button onClick={getHotels}>
            Hotels
        </button>
        
        {
            hotels && (
                hotels.map((hotel,index)=>{
                    const rating = getRandom()
                    const price = getPrice()
                return(
                        <div key={index} className='bg-neutral-400 p-4 rounded-xl my-4 mx-auto'>
                            <h2>{hotel.name}</h2>
                            {
                                hotel.amenities.map((item,index)=><h2 key={index}>{item}</h2>)
                            }
                            <h2>{price} Per Night</h2>
                            <h2>{rating} stars</h2>
                        </div>
                    )
                })
            )
        }
    </div>
  )
}

export default Hotels


