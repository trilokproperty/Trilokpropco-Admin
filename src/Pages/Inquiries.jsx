import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { endPoint } from "../../forAll/forAll";
import axios from "axios";

const Inquiries = () => {
    const [inquiries, setInquiries] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${endPoint}/inquire`);
          setInquiries(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, []);
    console.log(inquiries)
  const inquiriesPerPage = 5; // Adjust as needed
  const getVisibleinquiries = () => {
    const startIndex = (currentPage - 1) * inquiriesPerPage;
    const endIndex = Math.min(startIndex + inquiriesPerPage, inquiries?.length || 0);
    return inquiries?.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber <= 0 || pageNumber > Math.ceil(inquiries?.length / inquiriesPerPage)) {
      return;
    }
    setCurrentPage(pageNumber);
  };
  
      const handleDelete = async (id) => {
        console.log(id)
        const confirmDelete = window.confirm("Are you sure you want to delete this inqurie?");
        if (!confirmDelete) return;
    
        try {
          const response = await axios.delete(`${endPoint}/inquire/${id}`);
          setInquiries(inquiries.filter((inqurie) => inqurie._id !== id));
          console.log(response);
          toast.success("inqurie successfully deleted!", {
            position: "top-center",
          });
        } catch (error) {
          console.error("Error deleting inqurie:", error.response?.data, error);
          toast.error(
            error.response?.data?.message || "Failed to delete inqurie. Please try again.",
            {
              position: "top-center",
            }
          );
        }
      };
    return (
        <div>
        <div className="flex items-center justify-center flex-col gap-12 my-10">
        <ToastContainer />
        <div className="overflow-x-auto bg-white rounded-lg pt-5 lg:w-[90%] w-full lg:mx-32">
        <table className="table">
          <caption className="table-caption text-2xl font-bold mb-8">All inquiries</caption>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Message</th>
              <th>Project</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {inquiries?.length ? (
              getVisibleinquiries().map((inqurie, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <div className="flex flex-col gap-3">
                    <h1 className="font-bold">{inqurie?.name}</h1>
                    <div>
                      <p>{inqurie?.email}</p> 
                      <p>{inqurie?.phone}</p>
                    </div>
                    <p className="bg-gray-200 p-2 text-center rounded-lg">{inqurie.option}</p>
                  </div>
                </td>
                <td>
                <div dangerouslySetInnerHTML={{ __html: inqurie.message }}></div>
                </td>
                <td>{inqurie? inqurie?.project: "None"}</td>
                <td>
                    {inqurie?.created_at}
                </td>
                <th className="flex gap-2">
                  <button className="btn btn-error btn-xs text-white" onClick={() => handleDelete(inqurie?._id)}>Delete</button>
                </th>
              </tr>
            ))) : <tr><td colSpan="3" className="p-5 text-center">No inqurie is available.</td></tr>}
          </tbody>
        </table>
      </div> 
      </div>;
    {/* Pagination */}
    {inquiries?.length > inquiriesPerPage && (
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
          disabled={currentPage === Math.ceil(inquiries?.length / inquiriesPerPage)}
        >
          »
        </button>
      </div>
    )}
      </div>
    );
};

export default Inquiries;