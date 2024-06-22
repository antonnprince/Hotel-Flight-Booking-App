import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'
import room from "./room.jpg"

const Hotels = () => {
  //  const API_KEY = "470f24fdfaa0e1078cc6433c8eafde5ba8767b81e09fd35146acae47ac238988"
  // const auth = useAuth()
  const  user = JSON.parse(localStorage.getItem("user"))
  console.log(user)

  const [hotels, setHotels] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const hotelsPerPage = 6

  const getHotels = async () => {
    try {
      const res = await axios.get("https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=COK&radius=25&radiusUnit=KM&amenities=SWIMMING_POOL,SPA,FITNESS_CENTER,AIR_CONDITIONING,CASINO,JACUZZI,MASSAGE,BAR,MINIBAR&hotelSource=ALL", {
        headers: {
          'Authorization': `Bearer ${user["token"]}`,
        }
      })
      console.log(res.data)
      setHotels(res.data.data)
    } catch (error) {
      console.error("Failed to fetch hotels", error)
    }
  }
  
  useEffect(() => {
    getHotels()
  }, [])
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const indexOfLastHotel = currentPage * hotelsPerPage
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel)

  const totalPages = Math.ceil(hotels.length / hotelsPerPage)

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))
  }

  function getRandom() {
    return Math.floor(Math.random() * 5) + 1
  }

  function getPrice() {
    return Math.floor(Math.random() * 5000)
  }

  function getWord(word) {
    let formattedWord = word.replace(/_/g, ' ').toLowerCase()
    return formattedWord.charAt(0).toUpperCase() + formattedWord.slice(1)
  }

  return (
    <div className="flex justify-center items-center w-full mt-8 px-4">
      <div className="w-full md:w-3/4 lg:w-[80%] bg-white shadow-lg rounded-lg p-4 text-center mt-5">
        <h2 className="text-2xl md:text-4xl font-bold font-mono mb-4 text-indigo-500">Select a Hotel</h2>
        {
          currentHotels.map((hotel, index) => {
            const rating = getRandom()
            const price = getPrice()
            return (
              <div key={index} className="flex flex-col md:flex-row items-center border-b border-gray-200 py-4 px-2 mt-10 cursor-pointer hover:bg-slate-200">
                <img src={room} alt="Hotel Logo" className="w-16 md:w-[300px] h-16 md:h-[300px] object-contain mr-4 ml-10" />
                <div className="flex-1 mt-4 md:mt-0 ml-10">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                    <div>
                      <p className="text-xl md:text-2xl font-bold">{hotel.name}</p>
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-semibold">₹{price}/night</p>
                      <p className="text-sm md:text-lg text-gray-500 mt-5">Price</p>
                    </div>
                    <div>
                      <p className="text-sm md:text-lg ">
                        {
                          hotel.amenities.map((item, index) => {
                            const res = getWord(item)
                            return (
                              <h2 key={index} className='text-center'>{res}</h2>
                            )
                          })
                        }
                      </p>
                      <p className="text-sm md:text-lg text-gray-500 mt-5">Benefits</p>
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-semibold">{rating}</p>
                      <p className="text-sm md:text-lg text-gray-500 mt-5">Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
        <div className="flex justify-between items-center mt-8 mb-16">
          <button
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-indigo-500 text-white hover:bg-indigo-700'}`}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm md:text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`px-4 py-2 rounded-md h-10 w-20 ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-indigo-500 text-white hover:bg-indigo-700'}`}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hotels
