import axios from "axios";
import { endPoint } from "../../forAll/forAll";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

const Status = () => {
    const [statuses, setStatuses] = useState([]);
    const [formData, setFormData] = useState({
      status: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${endPoint}/status`);
          setStatuses(response.data);
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
      data.append('status', formData.status);
      data.append('image', imageFile);

      try {
        const response = await axios.post(
          `${endPoint}/status`,
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setStatuses([...statuses, response.data]);
        setLoading(false)
        toast.success("Status successfully added!", {
          position: "top-center",
        });
      } catch (error) {
        console.error("Error submitting form:", error.response.data, error);
        setLoading(false)
        toast.error(
          error.response.data.message ||
            "Failed to add status. Please try again.",
          {
            position: "top-center",
          }
        );
      }
    };

    const handleDelete = async (id) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this Status?");
      if (!confirmDelete) return;
  
      try {
        const response = await axios.delete(`${endPoint}/status/${id}`);
        setStatuses(statuses.filter((Status) => Status._id !== id));
        console.log(response);
        toast.success("Status successfully deleted!", {
          position: "top-center",
        });
      } catch (error) {
        console.error("Error deleting Status:", error.response?.data, error);
        toast.error(
          error.response?.data?.message || "Failed to delete Status. Please try again.",
          {
            position: "top-center",
          }
        );
      }
    };
  

    return (
        <div className="flex items-center justify-center flex-col gap-12 mx-1 relative overflow-hidden mb-10">
        { loading &&
          <div className="bg-[#0000003e] absolute w-full h-full z-10 md:py-52 lg:px-96 py-36 md:px-32">
              <div className="modal-box" >
              <h3 className="font-bold text-lg flex gap-5">Loading.. 
              <span className="loading loading-ring loading-lg"></span></h3>
            <p className="py-4">Please wait untill it loaded.</p>
          </div>
          </div>
        }
            <ToastContainer />
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6 lg:w-3/4 w-full bg-white rounded-lg mt-10 mx-1"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status Name</span>
                </label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Status Image</span>
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="file-input w-full max-w-xs"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Add Status
              </button>
            </form>

            <div className="overflow-x-auto bg-white rounded-lg pt-5 lg:w-3/4 w-full">
              <table className="table">
                <caption className="table-caption text-2xl font-bold mb-8">All Statuses</caption>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statuses.length ? statuses.map((status, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img src={status.image} alt={status.status} />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{status.status}</div>
                          </div>
                        </div>
                      </td>
                      <th className="flex gap-2">
                        <button className="btn btn-error btn-xs text-white" onClick={() => handleDelete(status._id)}>Delete</button>
                      </th>
                    </tr>
                  )) : <tr><td colSpan="3" className="p-5 text-center">No status is available.</td></tr>}
                </tbody>
              </table>
            </div>
        </div>
    );
};

export default Status;
