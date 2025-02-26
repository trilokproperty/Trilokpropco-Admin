import { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { endPoint } from '../../../forAll/forAll';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(user)
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await axios.get(`${endPoint}/user/me`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const login = async (formData, navigate) => {
    try {
      const response = await axios.post(`${endPoint}/user/login`, formData);
      console.log("Login response:", response.data); 
      
      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch user data after login
        const userResponse = await axios.get(`${endPoint}/user/me`);
        setUser(userResponse.data);

        navigate('/');
      } else {
        console.error("Login response does not contain expected data:", response.data);
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData, navigate) => {
    try {
      const response = await axios.post(`${endPoint}/user/signup`, formData); 
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      console.log(response.data.newUser);
      navigate('/');
    } catch (error) {
      console.error("Signup error:", error);
      throw error; // Rethrow to handle it in the component
    }
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };


  
  return (
      <AuthContext.Provider value={{ user, login, signup, logout, loading}}>
        {children}
      </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };