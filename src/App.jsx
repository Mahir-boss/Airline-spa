import React, { useState, useReducer } from 'react';

const initialFlights = [
  { id: 1, airline: 'SkyWings Air', flightNo: 'SW-204', from: 'New York (JFK)', to: 'London (LHR)', time: '08:00 AM - 08:00 PM', price: 450, seatsAvailable: 12 },
  { id: 2, airline: 'Global Jet', flightNo: 'GJ-512', from: 'Los Angeles (LAX)', to: 'Tokyo (NRT)', time: '11:30 AM - 03:30 PM (+1)', price: 780, seatsAvailable: 5 },
  { id: 3, airline: 'AeroExpress', flightNo: 'AE-109', from: 'Chicago (ORD)', to: 'Paris (CDG)', time: '06:00 PM - 08:30 AM (+1)', price: 520, seatsAvailable: 20 },
  { id: 4, airline: 'SkyWings Air', flightNo: 'SW-410', from: 'New York (JFK)', to: 'Miami (MIA)', time: '09:00 AM - 12:30 PM', price: 180, seatsAvailable: 8 }
];

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_BOOKING':
      return { ...state, bookings: [...state.bookings, action.payload] };
    case 'CANCEL_BOOKING':
      return { ...state, bookings: state.bookings.filter(b => b.id !== action.payload) };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    default:
      return state;
  }
};

export default function AirlineBookingApp() {
  const [state, dispatch] = useReducer(bookingReducer, {
    bookings: [],
    currentView: 'explore'
  });

  const [searchQuery, setSearchQuery] = useState({ from: '', to: '' });
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerName, setPassengerName] = useState('');
  const [seatNumber, setSeatNumber] = useState('12A');

  const filteredFlights = initialFlights.filter(flight => {
    const matchesFrom = flight.from.toLowerCase().includes(searchQuery.from.toLowerCase());
    const matchesTo = flight.to.toLowerCase().includes(searchQuery.to.toLowerCase());
    return matchesFrom && matchesTo;
  });

  const handleBookFlight = (e) => {
    e.preventDefault();
    if (!passengerName.trim()) return;

    const newBooking = {
      id: Date.now(),
      flight: selectedFlight,
      passenger: passengerName,
      seat: seatNumber,
      bookingDate: new Date().toLocaleDateString()
    };

    dispatch({ type: 'ADD_BOOKING', payload: newBooking });
    setSelectedFlight(null);
    setPassengerName('');
    alert('Flight booked successfully!');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#334155' }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#1e1b4b', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>✈️ SkyBooker SPA</h2>
        <div>
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'explore' })}
            style={{ background: state.currentView === 'explore' ? '#4f46e5' : 'transparent', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold' }}
          >
            Explore Flights
          </button>
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'bookings' })}
            style={{ background: state.currentView === 'bookings' ? '#4f46e5' : 'transparent', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            My Bookings ({state.bookings.length})
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        
        {state.currentView === 'explore' && (
          <div>
            <div style={{ backgroundColor: '#312e81', color: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
              <h1 style={{ margin: '0 0 0.5rem 0' }}>Find Your Next Adventure</h1>
              <p style={{ margin: '0 0 1.5rem 0', color: '#c7d2fe' }}>Search through available global routes and book instantly.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input 
                  type="text" 
                  placeholder="Departure City (e.g., New York)" 
                  value={searchQuery.from}
                  onChange={(e) => setSearchQuery({...searchQuery, from: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '6px', border: 'none', fontSize: '1rem' }}
                />
                <input 
                  type="text" 
                  placeholder="Destination City (e.g., London)" 
                  value={searchQuery.to}
                  onChange={(e) => setSearchQuery({...searchQuery, to: e.target.value})}
                  style={{ padding: '0.75rem', borderRadius: '6px', border: 'none', fontSize: '1rem' }}
                />
              </div>
            </div>

            <h2>Available Flights ({filteredFlights.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
              {filteredFlights.map(flight => (
                <div key={flight.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>{flight.airline}</span>
                        <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.2rem' }}>{flight.from} ➔ {flight.to}</h3>
                      </div>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>${flight.price}</span>
                    </div>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#64748b' }}><strong>Flight No:</strong> {flight.flightNo}</p>
                    <p style={{ margin: '0.25rem 0 1rem 0', fontSize: '0.9rem', color: '#64748b' }}><strong>Schedule:</strong> {flight.time}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{flight.seatsAvailable} seats left</span>
                    <button 
                      onClick={() => setSelectedFlight(flight)}
                      style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.currentView === 'bookings' && (
          <div>
            <h2>Your Reserved Itineraries</h2>
            {state.bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>You haven't booked any flights yet.</p>
                <button 
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'explore' })}
                  style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Browse Flights
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
                {state.bookings.map(item => (
                  <div key={item.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>Confirmed</span>
                    <h3 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>{item.flight.airline} ({item.flight.flightNo})</h3>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#64748b' }}><strong>Route:</strong> {item.flight.from} ➔ {item.flight.to}</p>
                    <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: '#64748b' }}><strong>Passenger:</strong> {item.passenger}</p>
                    <p style={{ margin: '0.25rem 0 1rem 0', fontSize: '0.9rem', color: '#64748b' }}><strong>Seat:</strong> {item.seat}</p>
                    <button 
                      onClick={() => dispatch({ type: 'CANCEL_BOOKING', payload: item.id })}
                      style={{ background: 'none', border: 'none', color: '#dc2626', padding: 0, cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                    >
                      Cancel Reservation
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {selectedFlight && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '400px', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Book Flight: {selectedFlight.flightNo}</h3>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#64748b' }}>{selectedFlight.from} to {selectedFlight.to}</p>
              
              <form onSubmit={handleBookFlight}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Passenger Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="Enter full name"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Seat Preference</label>
                  <select 
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white' }}
                  >
                    <option value="12A">12A (Window)</option>
                    <option value="12B">12B (Middle)</option>
                    <option value="12C">12C (Aisle)</option>
                    <option value="14F">14F (Window - Exit Row)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setSelectedFlight(null)}
                    style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{ backgroundColor: '#4f46e5', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}