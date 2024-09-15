// components/PrivateRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Component/AuthContext/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
   console.log(user)
   if(loading){
    return <div className='min-h-screen bg-[#09102e] flex justify-center align-middle'><span className="text-white loading loading-bars loading-lg ">Wait.....</span></div>
}
if(user){
  return children;
}else{
  return user ? element : <Navigate to="/login"></Navigate>;
};
}
export default PrivateRoute;