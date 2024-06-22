import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from './AuthContext'
import flight from './fligt.png'
import { FaPlaneDeparture } from 'react-icons/fa6';
import { MdFlightLand } from 'react-icons/md';
import NewBooking from './components/NewBooking';
import { FaArrowRightArrowLeft } from 'react-icons/fa6';

const Airports = () => {
  
  const user = JSON.parse(localStorage.getItem("user"))
  const [data,setData]=useState([])
  const [dictionary, setDictionary] =useState()
  const [currentPage, setCurrentPage] = useState(1);
  const [fromValue, setFromValue]=useState("")
  const [toValue, setToValue]=useState("")
  const [travelers, setTravelers] = useState({ adults: 1, children: 0, infants: 0 });
  const [date,setDate] = useState(new Date())
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tripType, setTripType] = useState('one-way');
  const [returnDate, setReturnDate]=useState(new Date())
  
    const swapValues = () => {
        setFromValue((prevFrom) => {
          setToValue((prevTo) => prevFrom);
          return toValue;
        });
    };

    const handleTripTypeChange = (type) => {
        setTripType(type);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
  
    const handleIncrement = (key) => {
        setTravelers((prevState) => ({
            ...prevState,
            [key]: prevState[key] + 1,
        }));
    };
  
    const handleDecrement = (key) => {
        if (travelers[key] > 0) {
            setTravelers((prevState) => ({
                ...prevState,
                [key]: prevState[key] - 1,
            }));
        }
    };
  
    const handleApply = () => {
        setDropdownOpen(false); // Close dropdown when Apply button is clicked
    };
  const flightsPerPage = 6;

  const getResults = async () => 
  {
      try {
        if(tripType==='one-way')
          {
            const res = await axios.get(
              `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${fromValue}&destinationLocationCode=${toValue}&departureDate=${date}&nonStop=false&adults=1&children=0&infants=0&nonStop=true&max=25&currencyCode=INR`,
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
          else
          {
            const res = await axios.get(
              `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${fromValue}&destinationLocationCode=${toValue}&departureDate=${date}&returnDate=${returnDate}&nonStop=false&adults=1&children=0&infants=0&nonStop=true&max=25&currencyCode=INR`,
                        {
                          headers: {
                            'Authorization': `Bearer ${user.token}`,
                          }
                        }
                      )
                      
          setData(res.data.data)
          setDictionary(res.data.dictionaries.carriers)
          console.log(res.data.data)
          console.log(res.data.dictionaries.carriers)
          } 
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
    window.scrollTo({top:0, behavior:'smooth'})
  },[currentPage])

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = data.slice(indexOfFirstFlight, indexOfLastFlight);

  const totalPages = Math.ceil(data.length / flightsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage)=>Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage)=>Math.min(prevPage + 1, totalPages));
  };
  const totalPassengers = travelers.adults + travelers.children + travelers.infants;

  return (
  <>  
    <div className="flex justify-center items-center w-full mt-8 px-4">
      <div className="w-full md:w-3/4 lg:w-[80%] bg-white shadow-lg rounded-lg p-4 text-center mt-5">
       <h2 className="text-2xl md:text-4xl font-bold font-mono mb-4 text-indigo-500">Select a Flight</h2>
       <div> 
            <div className="flex mb-8 space-x-3">
                  <button className={`w-24 md:w-32 h-8 md:h-10 font-medium text-sm md:text-xl hover:bg-indigo-500  hover:text-white rounded-full ${
                      tripType === 'one-way' ? 'bg-indigo-700 text-black' : 'bg-indigo-400 text-white'}`} 
                      onClick={()=>handleTripTypeChange('one-way')}>
                      One-Way
                  </button>
                  
                  <button className={`w-24 md:w-32 h-8 md:h-10 font-medium text-sm md:text-xl hover:bg-indigo-500  hover:text-white rounded-full ${
                      tripType === 'round-trip' ? 'bg-indigo-700 text-black' : 'bg-indigo-400 text-white'
                  }`} onClick={()=>handleTripTypeChange('round-trip')}>
                      Round Trip
                  </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-2">
                <input
                    type="text"
                    className="flex w-full md:w-1/3 rounded-lg p-3 md:p-5 border-2 text-sm md:text-xl"
                    placeholder="From"
                    value={fromValue}
                    onChange={(e)=>setFromValue(e.target.value)}
                />
                <button className="w-10 md:w-14 h-10 md:h-14 rounded-full flex justify-center items-center" onClick={swapValues}>
                    <FaArrowRightArrowLeft className="w-6 mt-3 md:w-10 h-6 md:h-10 text-slate-500 hover:text-slate-700" />
                </button>
                <input
                    type="text"
                    className="flex w-full md:w-1/3 rounded-lg p-3 md:p-5 border-2 text-sm md:text-xl"
                    placeholder="To"
                    value={toValue}
                    onChange={(e) => setToValue(e.target.value)}
                />
                <input
                    type="text"
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => (e.target.type = 'text')}
                    onChange={(e)=>setDate(e.target.value)}
                    className="flex w-full md:w-1/3 rounded-lg p-3 md:p-5 border-2 text-sm md:text-xl"
                    placeholder="Depart"
                />
                {tripType === 'round-trip' && (
                    <input
                        type="text"
                        onFocus={(e) => (e.target.type = 'date')}
                        onBlur={(e) => (e.target.type = 'text')}
                       onChange={(e)=>setReturnDate(e.target.value)}
                        className="flex w-full md:w-1/3 rounded-lg p-3 md:p-5 border-2 text-sm md:text-xl"
                        placeholder="Return"
                    />
                )}
            </div>
            <div className="w-[1000px] bg-white p-6 md:p-8 mt-20 md:mt-52">
              <div className="flex justify-end mt-8 gap-5 ">
                  <div className="flex justify-between items-center ">
                      <div className="flex space-x-4 items-center">
                          <label htmlFor="travelers" className="text-sm md:text-base">
                              Travelers
                          </label>
                          <div className="relative">
                              <button
                                  className="w-32 h-10 bg-gray-200 text-sm md:text-base rounded-md flex justify-between items-center px-2"
                                  onClick={toggleDropdown}
                              >
                                  {totalPassengers} Passenger(s)
                              </button>
                              {dropdownOpen && (
                                  <div className="absolute top-full left-0 w-40 bg-white shadow-lg rounded-lg border border-gray-200 mt-1">
                                      <div className="flex justify-between items-center px-2 py-1 border-b border-gray-200">
                                          <span>Adults</span>
                                          <div className="flex space-x-2 items-center">
                                              <button
                                                  className="text-gray-500 hover:text-gray-700"
                                                  onClick={()=>handleDecrement('adults')}
                                              >
                                                  -
                                              </button>
                                              <span>{travelers.adults}</span>
                                              <button
                                                  className="text-gray-500 hover:text-gray-700"
                                                  onClick={()=>handleIncrement('adults')}
                                              >
                                                  +
                                              </button>
                                          </div>
                                      </div>
                                      <div className="flex justify-between items-center px-2 py-1 border-b border-gray-200">
                                          <span>Children</span>
                                          <div className="flex space-x-2 items-center">
                                              <button
                                                  className="text-gray-500 hover:text-gray-700"
                                                  onClick={()=>handleDecrement('children')}
                                              >
                                                  -
                                              </button>
                                              <span>{travelers.children}</span>
                                              <button
                                                  className="text-gray-500 hover:text-gray-700"
                                                  onClick={()=>handleIncrement('children')}
                                              >
                                                  +
                                              </button>
                                          </div>
                                      </div>
                                      <div className="flex justify-between items-center px-2 py-1">
                                          <span>Infants</span>
                                          <div className="flex space-x-2 items-center">
                                              <button
                                                  className="text-gray-500 hover:text-gray-700"
                                                  onClick={()=>handleDecrement('infants')}
                                              >
                                                  -
                                              </button>
                                              <span>{travelers.infants}</span>
                                              <button
                                                  className="text-gray-500 hover:text-gray-700"
                                                  onClick={()=>handleIncrement('infants')}
                                              >
                                                  +
                                              </button>
                                          </div>
                                      </div>
                                      <button
                                          className="w-full py-2 bg-indigo-500 text-white rounded-b-lg hover:bg-indigo-700"
                                          onClick={handleApply}
                                      >
                                          Apply
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
                  <button
                      className="w-32 h-12 bg-indigo-500 rounded-full text-xl text-white hover:bg-indigo-700"
                      onClick={getResults}
                  >
                      Search
                  </button>
              </div>
            </div>
        </div>
        {  
         data && tripType==="one-way" &&
              ( 
                  data.map((item,index)=>{
                    let res = null;
                    const obj = item.itineraries[0].segments;
                  
                    obj.forEach((segment) => {
                      if (segment.arrival.iataCode===toValue) {
                        res = segment.arrival;
                        console.log("RES: ", res);
                        return;
                      }
                      else
                        return
                    });
                  
                    // Log the object if res is still null
                    if (!res) {
                      console.log("Could not find matching arrival for:", obj);
                    }
                     let airlines = getCarrier(item.validatingAirlineCodes[0])
                  return (
                      <div key={index} className="flex flex-col md:flex-row items-center border-b border-gray-200 py-4 px-2 mt-10 cursor-pointer hover:bg-slate-200">
                        <div className='flex flex-col'>
                          <img src={flight} alt="Flight Logo" className="w-16 md:w-20 h-16 md:h-20 object-contain mr-4 ml-10" />
                          <h1 className='mx-auto font-bold'>{airlines}</h1>
                        </div>
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
        {
          data && tripType!="one-way" &&
          (
            data.map((item,index)=>{

                let res
                const obj = item.itineraries[0].segments
                obj.forEach((item)=>{
                  if(item.arrival.iataCode===toValue)
                    {
                      res=item.arrival
                    }
                })
              
                let ret
                let ter
                const test = item.itineraries[1].segments
                // console.log(test)
                test.forEach((item)=>{
                  if(item.departure.iataCode===toValue)
                    {
                      ret=item.departure
                    }
                  if(item.arrival.iataCode===fromValue)
                    {
                      ter = item.arrival
                    }
                })

                let airlines = getCarrier(item.validatingAirlineCodes[0])
              return(
                <div key={index} className="flex flex-col md:flex-row items-center border-b border-gray-200 py-4 px-2 mt-10 cursor-pointer hover:bg-slate-200">
                        <div className='flex flex-col'>
                          <img src={flight} alt="Flight Logo" className="w-16 md:w-20 h-16 md:h-20 object-contain mr-4 ml-10" />
                          <h1 className='mx-auto font-bold'>{airlines}</h1>
                        </div>

                        <div className="flex-1 mt-4 md:mt-0 ml-10">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                            <div>
                              <p className="text-xl md:text-2xl font-semibold">{item.itineraries[0].segments[0].departure.at.substring(11).slice(0,-3)}</p>
                              <p>{item.itineraries[0].segments[0].departure.iataCode}</p>
                            <div className='flex gap-5 items-center justify-center mt-5'>
          
                              <p className="text-sm md:text-lg text-gray-500">Departure</p>
                              <FaPlaneDeparture className='text-gray-500'/> 
                            </div>
                            </div>
                            <div>
                              <p className="text-xl md:text-2xl font-semibold">{res.at.substring(11).slice(0,-3)}</p>
                              <div className='flex gap-5 items-center justify-center mt-5'>
                                <p>{res.iataCode}</p>
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
                        
                        <div className="flex-1 mt-4 md:mt-0 ml-10">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                              <div>
                              <p className="text-xl md:text-2xl font-semibold">
                              {ret.at.substring(11).slice(0,-3)}
                              </p>
                                <div className='flex gap-5 items-center justify-center mt-5'>
                                    <p>{ret.iataCode}</p>
                                    <p className="text-sm md:text-lg text-gray-500">Departure</p>
                                    <FaPlaneDeparture className='text-gray-500'/> 
                                </div>
                            </div>

                           <div>
                              <p className="text-xl md:text-2xl font-semibold">{ter.at.substring(11).slice(0,-3)}</p>
                                <div className='flex gap-5 items-center justify-center mt-5'>
                                    <p>{ter.iataCode}</p>
                                    <p className="text-sm md:text-lg text-gray-500">Arrival</p>
                                    <MdFlightLand className='text-gray-500 text-xl' /> 
                                  
                                </div>
                            </div> 

                            <div>
                              <p className="text-xl md:text-2xl font-semibold">₹{item.price.total.slice(0,-3)}</p>
                              <p className="text-sm md:text-lg text-gray-500 mt-5">Total Price</p>
                            </div>
                            
                            <div>
                              <p className="text-xl md:text-2xl font-semibold">{item.itineraries[1].duration.substring(2).toLowerCase()}</p>
                              <p className="text-sm md:text-lg text-gray-500 mt-5">Duration</p>
                            </div>
                          
                          </div>
                        </div>
                      </div>  
              )
            })
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
        </>
  )
}

export default Airports
