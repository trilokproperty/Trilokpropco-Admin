import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { endPoint } from "../../forAll/forAll";

const Services = () => {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    details: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${endPoint}/service`);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file upload for logo
  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  // Handle form submission to add a new service
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("details", formData.details);
    data.append("logo", logoFile);

    try {
      const response = await axios.post(`${endPoint}/service`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setServices([...services, response.data]);
      setLoading(false);
      toast.success("Service successfully added!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error submitting form:", error.response.data, error);
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Failed to add service. Please try again.",
        {
          position: "top-center",
        }
      );
    }
  };

  // Handle delete action for a specific service
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this service?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${endPoint}/service/${id}`);
      setServices(services.filter((service) => service._id !== id));
      toast.success("Service successfully deleted!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error deleting service:", error.response?.data, error);
      toast.error(
        error.response?.data?.message || "Failed to delete service. Please try again.",
        {
          position: "top-center",
        }
      );
    }
  };

  return (
    <div className="flex items-center justify-center flex-col gap-12 mx-1 relative overflow-hidden mb-10">
      <ToastContainer />
      {loading && (
        <div className="bg-[#0000003e] absolute w-full h-full z-10 py-36 px-32">
          <div className="modal-box">
            <h3 className="font-bold text-lg flex gap-5">
              Loading..
              <span className="loading loading-ring loading-lg"></span>
            </h3>
            <p className="py-4">Please wait until it loads.</p>
          </div>
        </div>
      )}

      {/* Form to add a new Service */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 lg:w-3/4 w-full bg-white rounded-lg mt-10 mx-1"
      >
        <div className="form-control">
          <label className="label"> <span className="label-text">Service Name</span> </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label"> <span className="label-text">Service Details</span> </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="textarea textarea-bordered"
            required
          ></textarea>
        </div>
        <div className="form-control">
          <label className="label"> <span className="label-text">Logo</span> </label>
          <input
            type="file"
            name="logo"
            onChange={handleFileChange}
            className="file-input w-full max-w-xs"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Service
        </button>
      </form>

      {/* Display list of services */}
      <div className="overflow-x-auto bg-white rounded-lg pt-5 lg:w-3/4 w-full">
        <table className="table">
          <caption className="table-caption text-2xl font-bold mb-8">All Services</caption>
          <thead>
            <tr>
              <th>No</th>
              <th>Service Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length ? (
              services.map((service, index) => (
                <tr key={service._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={service.logo} alt={service.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{service.name}</div>
                        <div className="text-sm opacity-50">{service.details}</div>
                      </div>
                    </div>
                  </td>
                  <th className="flex gap-2">
                    <button className="btn btn-error btn-xs text-white" onClick={() => handleDelete(service._id)}>
                      Delete
                    </button>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-5 text-center">
                  No services available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
