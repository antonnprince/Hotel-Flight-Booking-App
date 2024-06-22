import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'
import flight from './fligt.png'
import { FaPlaneDeparture } from 'react-icons/fa6';
import { MdFlightLand } from 'react-icons/md';
const Airports = () => {
  
  const user = JSON.parse(localStorage.getItem("user"))
  console.log(user)
  const [data,setData]=useState([])
  const [dictionary, setDictionary] =useState()
  const [currentPage, setCurrentPage] = useState(1);
  
  
  const flightsPerPage = 6;
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

  useEffect(()=>{
    getResults()
  },[])

  useEffect(()=>{
    window.scrollTo({top:0, behavior:'smooth'})
  },[currentPage])

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = data.slice(indexOfFirstFlight, indexOfLastFlight);

  const totalPages = Math.ceil(data.length / flightsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  return (
    <div className="flex justify-center items-center w-full mt-8 px-4">
      <div className="w-full md:w-3/4 lg:w-[80%] bg-white shadow-lg rounded-lg p-4 text-center mt-5">
       <h2 className="text-2xl md:text-4xl font-bold font-mono mb-4 text-indigo-500">Select a Flight</h2>
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
                          // const airlines = getCarrier(item.validatingAirlineCodes[0])
                    })
                  return (
                      <div key={index} className="flex flex-col md:flex-row items-center border-b border-gray-200 py-4 px-2 mt-10 cursor-pointer hover:bg-slate-200">
                        <img src={flight} alt="Flight Logo" className="w-16 md:w-20 h-16 md:h-20 object-contain mr-4 ml-10" />
                        <div className="flex-1 mt-4 md:mt-0 ml-10">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                            <div>
                              <p className="text-xl md:text-2xl font-semibold">{item.itineraries[0].segments[0].departure.at.substring(11).slice(0,-3)}</p>
                            <div className='flex gap-5 items-center justify-center mt-5'>
          
                              <p className="text-sm md:text-lg text-gray-500">Departure</p>
                              <FaPlaneDeparture className='text-gray-500'/> 
                            </div>
                            </div>
                            <div>
                              <p className="text-xl md:text-2xl font-semibold">{res.at.substring(11).slice(0,-3)}</p>
                              <div className='flex gap-5 items-center justify-center mt-5'>
                              <p className="text-sm md:text-lg text-gray-500">Arrival</p>
                              <MdFlightLand className='text-gray-500 text-xl' /> 
                              </div>
                            </div>
                            <div>
                              <p className="text-xl md:text-2xl font-semibold">₹{item.price.total.slice(0,-3)}</p>
                              <p className="text-sm md:text-lg text-gray-500 mt-5">Total Price</p>
                            </div>
                            <div>
                              <p className="text-xl md:text-2xl font-semibold">{item.itineraries[0].duration.substring(2).toLowerCase()}</p>
                              <p className="text-sm md:text-lg text-gray-500 mt-5">Duration</p>
                            </div>
                          </div>
                        </div>
                      </div>               
                  )}
                  )
              )
        }
        <div className="flex justify-between items-center mt-8 mb-16">
            <button
              className={`px-4 py-2 rounded-md  ${currentPage === 1 ? 'bg-gray-200 text-gray-400 ' : 'bg-indigo-500 text-white hover:bg-indigo-700'}`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm md:text-lg">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={`px-4 py-2 rounded-md h-10 w-20  ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-indigo-500 text-white hover:bg-indigo-700'}`}
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

export default Airports
