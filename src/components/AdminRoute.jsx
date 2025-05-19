import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function AdminRoute({ children }) {
    const { user, token } = useSelector((state) => state.auth);
    const location = useLocation();

    // Check if we have both user and token
    if (!user || !token) {
        console.log('AdminRoute: No user or token found. Redirecting to login.');
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Check if user has admin or root role
    if (!['admin', 'root'].includes(user.role)) {
        console.log('AdminRoute: User does not have admin privileges. Redirecting to home.');
        return <Navigate to="/" replace />;
    }

    // User is authenticated and has admin rights
    console.log('AdminRoute: Access granted to admin route');
    return children;
}