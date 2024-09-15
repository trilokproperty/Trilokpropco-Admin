import axios from "axios";
import { endPoint } from "../../forAll/forAll";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BlogsLists = () => {
    const [blogs, setBlogs] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const handleEdit = (blog) => {
      navigate("/addBlog", { state: { blog } });
      console.log(blog)
    };
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${endPoint}/blog`);
          setBlogs(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, []);
  const blogsPerPage = 1; // Adjust as needed
  const getVisibleBlogs = () => {
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = Math.min(startIndex + blogsPerPage, blogs?.length || 0);
    return blogs?.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber <= 0 || pageNumber > Math.ceil(blogs?.length / blogsPerPage)) {
      return;
    }
    setCurrentPage(pageNumber);
  };
  
      const handleDelete = async (id) => {
        console.log(id)
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmDelete) return;
    
        try {
          const response = await axios.delete(`${endPoint}/blog/${id}`);
          setBlogs(blogs.filter((blog) => blog._id !== id));
          console.log(response);
          toast.success("blog successfully deleted!", {
            position: "top-center",
          });
        } catch (error) {
          console.error("Error deleting blog:", error.response?.data, error);
          toast.error(
            error.response?.data?.message || "Failed to delete blog. Please try again.",
            {
              position: "top-center",
            }
          );
        }
      };

      const formatDate = (isoDateString) => {
        if (!isoDateString) return "No Date";
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      };
      
     
    return (
      <div>
        <div className="flex items-center justify-center flex-col gap-12 my-10">
        <ToastContainer />
        <div className="overflow-x-auto bg-white rounded-lg pt-5 lg:w-[90%] w-full lg:mx-32">
        <table className="table">
          <caption className="table-caption text-2xl font-bold mb-8">All Blogs</caption>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {blogs?.length ? (
              getVisibleBlogs().map((blog, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <div className="flex items-center gap-3 justify-center">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={blog.image} alt={blog.title} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold mb-2">{blog.title}</div>
                      <p>{formatDate(blog?.date)}</p>
                    </div>
                  </div>
                </td>
                <td>
                <div dangerouslySetInnerHTML={{ __html: blog.description }}></div>
                </td>
                <th className="flex gap-2">
                  <button className="btn btn-success text-white btn-xs" onClick={() => handleEdit(blog)}>Update</button>
                  <button className="btn btn-error btn-xs text-white" onClick={() => handleDelete(blog?._id)}>Delete</button>
                  <button className="btn btn-info btn-xs text-white" >
                    View
                  </button>
                </th>
              </tr>
            ))) : <tr><td colSpan="3" className="p-5 text-center">No blog is available.</td></tr>}
          </tbody>
        </table>
      </div> 
      </div>;
    {/* Pagination */}
    {blogs?.length > blogsPerPage && (
      <div className="join mt-5 flex items-center justify-center my-10">
        <button
          className="join-item btn disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>
        <button className="join-item btn">{currentPage}</button>
        <button
          className="join-item btn disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(blogs?.length / blogsPerPage)}
        >
          »
        </button>
      </div>
    )}
      </div>)};
export default BlogsLists;