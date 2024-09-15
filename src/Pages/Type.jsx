import axios from "axios";
import { endPoint } from "../../forAll/forAll";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

const Type = () => {
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endPoint}/type`);
        setTypes(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const data = new FormData();
    data.append('type', formData.type);
    data.append('logo', imageFile);

    try {
      const response = await axios.post(
        `${endPoint}/type`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setTypes([...types, response.data]);
      setLoading(false)
      toast.success("Type successfully added!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error submitting form:", error.response.data, error);
      setLoading(false)
      toast.error(
        error.response.data.message ||
          "Failed to add type. Please try again.",
        {
          position: "top-center",
        }
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Type?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${endPoint}/type/${id}`);
      setTypes(types.filter((type) => type._id !== id));
      console.log(response);
      toast.success("Type successfully deleted!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error deleting Type:", error.response?.data, error);
      toast.error(
        error.response?.data?.message || "Failed to delete Type. Please try again.",
        {
          position: "top-center",
        }
      );
    }
  };

  return (
    <div className="flex items-center justify-center flex-col gap-12 mx-1 relative overflow-hidden mb-10">
      <ToastContainer />
      { loading &&
        <div className="bg-[#0000003e] absolute w-full h-full z-10 md:py-52 lg:px-96 py-36 md:px-32">
            <div className="modal-box" >
            <h3 className="font-bold text-lg flex gap-5">Loading.. 
            <span className="loading loading-ring loading-lg"></span></h3>
          <p className="py-4">Please wait untill it loaded.</p>
        </div>
        </div>
      }
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 lg:w-3/4 w-full bg-white rounded-lg mt-10"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">Type Name</span>
          </label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Type Image</span>
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
          Add Type
        </button>
      </form>
      <div className="overflow-x-auto bg-white rounded-lg pt-5 lg:w-3/4 w-full">
        <table className="table">
          <caption className="table-caption text-2xl font-bold mb-8">All Types</caption>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {types.length ? types.map((type, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={type.logo} alt={type.type} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{type.type}</div>
                    </div>
                  </div>
                </td>
                <th className="flex gap-2">
                  <button className="btn btn-error btn-xs text-white" onClick={() => handleDelete(type._id)}>Delete</button>
                </th>
              </tr>
            )) : <tr><td colSpan="3" className="p-5 text-center">No type is available.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Type;
