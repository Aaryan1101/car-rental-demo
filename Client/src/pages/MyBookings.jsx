import { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'motion/react'

const MyBookings = () => {

  const { api, user, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    if (!user) {
      toast.error('Please log in to view your bookings');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Debug information
      console.log('Making bookings request with:', {
        baseURL: import.meta.env.VITE_API_BASE_URL,
        token: localStorage.getItem('token'),
        userId: user?._id
      });

      const { data } = await api.get('/api/user/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Bookings API response:', data);

      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Bookings fetch error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        config: error.config,
        url: error.config?.url
      });
      
      if (error.response?.status === 401) {
        toast.error('Please log in again to view your bookings');
      } else if (error.response?.status === 404) {
        toast.error('Booking service not available');
      } else {
        toast.error('Failed to fetch bookings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching bookings');
      fetchMyBookings();
    } else {
      console.log('No user found, skipping bookings fetch');
      setLoading(false);
    }
  }, [user]);


  return (
    <motion.div 
    initial={{opacity:0, y:30}}
    animate={{opacity:1, y:0}}
    transition={{duration:0.6}}
    className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>

      <Title title='My Bookings'
        subTitle='View and manage your all car bookings'
        align='left' />

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found. Start by booking a car!</p>
        </div>
      ) : (
        <div className="space-y-4">
        {bookings.map((booking, index) => (
          
          <motion.div 
          initial={{opacity:0, y:20}}
          animate={{opacity:1, y:0}}
          transition={{delay:index*0.1,duration:0.4}}
          key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6
          border border-borderColor rounded-lg mt-5 first:mt-12'>

            {/*Car Image + Car info */}
            <div className='md:col-span-1'>
              <div className='rounded-md overflow-hidden mb-3'>
                <img src={booking.car.image} alt="" className='w-full h-auto
                aspect-video object-cover'/>
              </div>
              <p className='text-lg font-medium mt-2'>{booking.car.brand} {booking.car.model}</p>

              <p className='text-gray-500'>{booking.car.year}.{booking.car.category}.
                {booking.car.location}
              </p>
            </div>

            {/*Booking Info */}
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2'>
                <p
  className={`px-3 py-1 text-xs rounded-full 
    ${booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : ''} 
    ${booking.status === 'pending' ? 'bg-yellow-400/15 text-yellow-600' : ''} 
    ${booking.status === 'cancelled' ? 'bg-red-400/15 text-red-600' : ''}`}
>
  {booking.status}
</p>
              </div>
              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500'>Rental Period</p>
                  <p>{booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}</p>
                </div>
              </div>


              <div className='flex items-start gap-2 mt-3'>
                <img src={assets.location_icon} alt="" className='w-4 h-4 mt-1' />
                <div>
                  <p className='text-gray-500'>Pick-up Location</p>
                  <p>{booking.car.location}</p>
                </div>
              </div>
            </div>

            {/*Price */}
            <div className='md:col-span-1 flex flex-col justify-between gap-6'>
              <div className='text-sm text-gray-500 text-right'>
                <p>Total Price</p>
                <h1 className='text-2xl font-semibold text-primary'>{currency}{booking.price}</h1>
              <p>Booked on {booking.createdAt.split('T')[0]}</p>
              </div>
            </div>

          </motion.div>
        ))}
      </div>
      )}
    </motion.div>
  )
}

export default MyBookings