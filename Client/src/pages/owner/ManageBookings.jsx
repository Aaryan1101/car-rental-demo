import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const {api, currency}=useAppContext()
  const [bookings, setBookings] = useState([])

  const [loading, setLoading] = useState(true);

  const fetchOwnerBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching owner bookings...');
      
      const { data } = await api.get('/api/bookings/owner');
      
      if (data.success) {
        console.log('Received bookings:', data.bookings);
        setBookings(data.bookings);
      } else {
        console.error('Failed to fetch bookings:', data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  const changeBookingStatus= async (bookingId, status) => {
   try {
   const { data } = await api.post('/api/bookings/change-status', { bookingId, status })

    if(data.success){
      toast.success(data.message)
      fetchOwnerBookings()
    }else{
          toast.error(data.message)

    }
   } catch (error) {
    toast.error(error.message)
   }
  }

  useEffect(() => {
    fetchOwnerBookings();
    
    // Refresh bookings every 30 seconds
    const interval = setInterval(() => {
      fetchOwnerBookings();
    }, 30000);

    return () => clearInterval(interval);
  }, [])


  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or 
      cancel request, and manage booking statuses."
        align='left' />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No bookings found
          </div>
        ) : (
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} className='border-t border-borderColor text-gray-500'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={booking.car.image} alt='' className='h-12 w-12 aspect-square rounded-md object-cover' />
                  <p className='font-medium max-md:hidden'>{booking.car.brand}{booking.car.model}</p>
                </td>

                <td className='p-3 max-md:hidden'>
                  {booking.pickupDate.split('T')[0]} to  {booking.returnDate.split('T')[0]}
                </td>

                <td className='p-3'>{currency}{booking.price}</td>

                <td className='p-3 max-md:hidden'>
                  <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>offline</span>
                </td>

                <td className='p-3'>
                  {booking.status === 'pending' ? (
                    <select onChange={e=>changeBookingStatus(booking._id,
                      e.target.value)}value={booking.status} className='px-2 py-1.5 mt-1 text-gray-500 *:
                    border border-borderColor rounded-md outline-none'>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span className={`px-3 py1 rounded-full text-xs font-semibold
                      ${booking.status==='confirmed'? 'bg-green-100 text-green-500':'bg-red-100 text-red-500'}`}>
                        {booking.status}
                      </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>

  )
}

export default ManageBookings