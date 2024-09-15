import axios from "axios";
import { endPoint } from "../../forAll/forAll";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

const Developer = () => {
  const [developers, setDevelopers] = useState();
  const [formData, setFormData] = useState({
    name: '',
    details: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get(`${endPoint}/developer`);
            console.log(response.data);
            setDevelopers(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, [endPoint]);

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
    data.append('name', formData.name);
    data.append('details', formData.details);
    data.append('image', imageFile);

    try {
      const response = await axios.post(
        `${endPoint}/developer`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data);
      setLoading(false)
      toast.success("Developer successfully added!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error submitting form:", error.response.data, error);
      setLoading(false)
      toast.error(
        error.response.data.message ||
          "Failed to add developer. Please try again.",
        {
          position: "top-center",
        }
      );
    }
  };
  
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Developer?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${endPoint}/developer/${id}`);
      setDevelopers(developers.filter((developer) => developer._id !== id));
      console.log(response);
      toast.success("Developer successfully deleted!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error deleting Developer:", error.response?.data, error);
      toast.error(
        error.response?.data?.message || "Failed to delete Developer. Please try again.",
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
            <span className="label-text">Name</span>
          </label>
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
          <label className="label">
            <span className="label-text">Developer Image</span>
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="file-input w-full max-w-xs"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Details</span>
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleChange}
            className="textarea w-full textarea-bordered"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Developer
        </button>
      </form>

      <div className="overflow-x-auto bg-white rounded-lg pt-5 lg:w-3/4 w-full" >
  <table className="table">
    <caption className="table-caption text-2xl font-bold mb-8">All Developers</caption>
    <thead>
      <tr>
        <th>No</th>
        <th>Name</th>
        <th>Details</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {developers? developers.map((developer, index) => 
        <tr key={index}>
        <td>{index + 1}</td>
        <td>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="mask mask-squircle h-12 w-12"><img
                  src={developer.image} />
              </div>
            </div>
            <div>
              <div className="font-bold">{developer.name}</div>
            </div>
          </div>
        </td>
        <td>{developer.details}</td>
        <th className="flex gap-2">
          <button className="btn btn-error btn-xs text-white" onClick={() => handleDelete(developer._id)}>delete</button>
        </th>
      </tr>
      ) :<p className="p-5">No developer is available.</p>}
      
      </tbody></table></div>
    </div>
  );
};

export default Developer;
