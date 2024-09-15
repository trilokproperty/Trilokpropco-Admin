import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Component/AuthContext/AuthContext";
import { toast, ToastContainer } from "react-toastify";

const LogIn = () => { 
    const { login, loading } = useContext(AuthContext);
    const navigate = useNavigate();
// State to store form data and loader
const [formData, setFormData] = useState({
  email: '',
  password: '',
});
// Handle input change
const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    try{
     await login(formData, navigate)
     toast.success("Log In Successful")
    }
    catch (error) {
        // Handle errors appropriately (e.g., display error toast)
        console.error("Signup error:", error);
        toast.error("Log In Failed! Please check your details."); // Show error toast
      }
  };

    return (
    <div className="md:w-1/3 w-[80%] mx-auto my-16">
        <h3 className='text-3xl font-semibold text-center my-7'>Log In</h3>
       <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            />
            <path
              d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            />
          </svg>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="grow"
            placeholder="Email"
            required
          />
        </label>

        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="grow"
            placeholder="Password"
            required
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading} // Disable button when loading
        >
          {loading ? 'Loging In...' : 'Log In'} {/* Show loader text */}
        </button>
      </form>     
      <Link to="/signup" ><p className='text-center mt-3'>SignUp</p></Link>
      <ToastContainer />
    </div>
    );
};

export default LogIn;