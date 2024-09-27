import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { endPoint } from "../../forAll/forAll";

const Services = () => {
  const [services, setServices] = useState([]);
  const [serviceFormData, setServiceFormData] = useState({
    name: "",
    details: "",
    logo: null,
  });

  const [sectionTextFormData, setSectionTextFormData] = useState({
    sectionText: "",
    serviceTextId: null,
  });

  const [loading, setLoading] = useState(false);
  
  // Fetch all services and service texts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const [servicesResponse, textsResponse] = await Promise.all([
          axios.get(`${endPoint}/service`),
          axios.get(`${endPoint}/service/text`),
        ]);
        setServices(servicesResponse.data);
        
        if (textsResponse.data.length > 0) {
          const firstText = textsResponse.data[0];
          setSectionTextFormData({
            sectionText: firstText.serviceDes,
            serviceTextId: firstText._id,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchServices();
  }, []);

  // Handle input changes for service fields
  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceFormData({
      ...serviceFormData,
      [name]: value,
    });
  };

  // Handle input changes for section text
  const handleSectionTextChange = (e) => {
    const { name, value } = e.target;
    setSectionTextFormData({
      ...sectionTextFormData,
      [name]: value,
    });
  };

  // Handle file upload for logo
  const handleFileChange = (e) => {
    setServiceFormData({
      ...serviceFormData,
      logo: e.target.files[0],
    });
  };

  // Handle form submission to add a new service
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const serviceData = new FormData();
    serviceData.append("name", serviceFormData.name);
    serviceData.append("details", serviceFormData.details);
    serviceData.append("logo", serviceFormData.logo);

    try {
      const serviceResponse = await axios.post(`${endPoint}/service`, serviceData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setServices([...services, serviceResponse.data]);
      toast.success("Service successfully added!", {
        position: "top-center",
      });

      // Reset form data
      setServiceFormData({ name: "", details: "", logo: null });
    } catch (error) {
      console.error("Error adding service:", error.response?.data, error);
      toast.error(
        error.response?.data?.message || "Failed to add service. Please try again.",
        {
          position: "top-center",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission to add or update service text
  const handleSectionTextSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (sectionTextFormData.serviceTextId) {
        // Update existing service text
        const updateResponse = await axios.put(`${endPoint}/service/text/${sectionTextFormData.serviceTextId}`, {
          serviceDes: sectionTextFormData.sectionText,
        });
        console.log("Service text updated:", updateResponse.data);
        toast.success("Service text successfully updated!", {
          position: "top-center",
        });
      } else {
        // Add new service text
        const sectionTextResponse = await axios.post(`${endPoint}/service/text`, {
          serviceDes: sectionTextFormData.sectionText,
        });
        console.log("Section text submitted:", sectionTextResponse.data);
        toast.success("Service text successfully added!", {
          position: "top-center",
        });
      }

      // Reset section text form data
      setSectionTextFormData({ sectionText: "", serviceTextId: null });
    } catch (error) {
      console.error("Error submitting section text:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Failed to add/update service text. Please try again.",
        {
          position: "top-center",
        }
      );
    } finally {
      setLoading(false);
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
      console.error("Error deleting service:", error.response?.data);
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
        onSubmit={handleServiceSubmit}
        className="space-y-4 p-6 lg:w-3/4 w-full bg-white rounded-lg mt-10 mx-1"
      >
        <h2 className="text-lg font-bold">Add New Service</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Service Name</span>
          </label>
          <input
            type="text"
            name="name"
            value={serviceFormData.name}
            onChange={handleServiceChange}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Service Details</span>
          </label>
          <textarea
            name="details"
            value={serviceFormData.details}
            onChange={handleServiceChange}
            className="textarea textarea-bordered"
            required
          ></textarea>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Logo</span>
          </label>
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

      {/* Form to add or update Service Text */}
      <form
        onSubmit={handleSectionTextSubmit}
        className="space-y-4 p-6 lg:w-3/4 w-full bg-white rounded-lg mt-10 mx-1"
      >
        <h2 className="text-lg font-bold">Add/Update Section Text</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Section Text</span>
          </label>
          <textarea
            name="sectionText"
            value={sectionTextFormData.sectionText}
            onChange={handleSectionTextChange}
            className="textarea textarea-bordered"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          {sectionTextFormData.serviceTextId ? "Update Service Text" : "Add Service Text"}
        </button>
      </form>

      {/* Display list of services */}
      <div className="overflow-x-auto bg-white rounded-lg pt-5 lg:w-3/4 w-full">
        <table className="table">
          <caption className="table-caption text-2xl font-bold mb-8">All Services</caption>
          <thead>
            <tr>
              <th>No</th>
              <th>Image</th>
              <th>Name</th>
              <th>Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service._id}>
                <td>{index + 1}</td>
                <td>
                  <img src={service.logo} alt={service.name} className="w-16 h-16 object-cover" />
                </td>
                <td>{service.name}</td>
                <td>{service.details}</td>
                <td>
                  <button onClick={() => handleDelete(service._id)} className="btn text-white btn-error">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
