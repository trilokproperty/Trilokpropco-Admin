import axios from "axios";
import { endPoint } from "../../forAll/forAll";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

const WhyUs = () => {
  const [whyItems, setWhyItems] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all "Why Us" items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endPoint}/why`);
        setWhyItems(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
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

  // Handle form submission to add a new "Why Us" item
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("logo", logoFile);

    try {
      const response = await axios.post(`${endPoint}/why`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setWhyItems([...whyItems, response.data]);
      setLoading(false);
      toast.success("Why Us item successfully added!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error submitting form:", error.response.data, error);
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Failed to add item. Please try again.",
        {
          position: "top-center",
        }
      );
    }
  };

  // Handle delete action for a specific "Why Us" item
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${endPoint}/why/${id}`);
      setWhyItems(whyItems.filter((item) => item._id !== id));
      toast.success("Why Us item successfully deleted!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error deleting item:", error.response?.data, error);
      toast.error(
        error.response?.data?.message || "Failed to delete item. Please try again.",
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
      
      {/* Form to add a new Why Us item */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 lg:w-3/4 w-full bg-white rounded-lg mt-10 mx-1"
      >
        <div className="form-control">
          <label className="label"> <span className="label-text">Title</span> </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label"> <span className="label-text">Description</span> </label>
          <textarea
            name="description"
            value={formData.description}
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
          Add Why Us
        </button>
      </form>

      {/* Display list of Why Us items */}
      <div className="overflow-x-auto bg-white rounded-lg pt-5 lg:w-3/4 w-full">
        <table className="table">
          <caption className="table-caption text-2xl font-bold mb-8">All Why Us Items</caption>
          <thead>
            <tr>
              <th>No</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {whyItems.length ? (
              whyItems.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={item.logo} alt={item.title} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{item.title}</div>
                        <div className="text-sm opacity-50">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <th className="flex gap-2">
                    <button className="btn btn-error btn-xs text-white" onClick={() => handleDelete(item._id)}>
                      Delete
                    </button>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-5 text-center">
                  No Why Us items available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WhyUs;
