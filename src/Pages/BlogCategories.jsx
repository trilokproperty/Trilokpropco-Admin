import { useEffect, useState } from "react";
import { endPoint } from "../../forAll/forAll";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";


const BlogCategories = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        category: '',
    });
  const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${endPoint}/blogCategory`);
            setCategories(response.data);
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

      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
  
        try {
          const response = await axios.post(
            `${endPoint}/blogCategory`,
            formData
          );
          setCategories([...categories, response.data]);
          setLoading(false)
          toast.success("category successfully added!", {
            position: "top-center",
          });
        } catch (error) {
          console.error("Error submitting form:", error.response.data, error);
          setLoading(false)
          toast.error(
            error.response.data.message ||
              "Failed to add category. Please try again.",
            {
              position: "top-center",
            }
          );
        }
      };
      const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
          try {
            await axios.delete(`${endPoint}/blogCategory/${id}`);
            setCategories(categories.filter(category => category._id !== id));
            toast.success("Category successfully deleted!", {
              position: "top-center",
            });
          } catch (error) {
            console.error("Error deleting category:", error.response.data, error);
            toast.error(
              error.response.data.message ||
                "Failed to delete category. Please try again.",
              {
                position: "top-center",
              }
            );
          }
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
          className="space-y-4 p-6 lg:w-3/4 w-full bg-white rounded-lg mt-10 mx-1"
        >
          <div className="form-control">
            <label className="label">
              <span className="label-text">Category Name</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add category
          </button>
        </form>

        <div className="overflow-x-auto bg-white rounded-lg pt-5 lg:w-3/4 w-full">
          <table className="table">
            <caption className="table-caption text-2xl font-bold mb-8">All categories</caption>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length ? categories.map((category, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold">{category.category}</div>
                      </div>
                    </div>
                  </td>
                  <th className="flex gap-2">
                    <button className="btn btn-error btn-xs text-white" onClick={() =>handleDelete(category._id)}>Delete</button>
                  </th>
                </tr>
              )) : <tr><td colSpan="3" className="p-5 text-center">No category is available.</td></tr>}
            </tbody>
          </table>
        </div>
    </div>
    );
};

export default BlogCategories;