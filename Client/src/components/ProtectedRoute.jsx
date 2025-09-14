import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, ownerRequired = false }) => {
  const { user, isOwner } = useAppContext();

  if (!user) {
    toast.error('Please login to access this page');
    return <Navigate to="/" replace />;
  }

  if (ownerRequired && !isOwner) {
    toast.error('Only car owners can access this page');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;