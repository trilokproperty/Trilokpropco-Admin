import axios from "axios";
import { endPoint } from "../../forAll/forAll";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState({});
  const navigate = useNavigate();

  const handleEdit = (property) => {
    navigate("/add", { state: { property } });
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;

  const truncateText = (str, numWords) => {
    const words = str.split(" ");
    if (words.length > numWords) {
      return words.slice(0, numWords).join(" ") + "...";
    }
    return str;
  };

  const stripHtmlTags = (str) => {
    if (str === null || str === "") return "";
    return str.replace(/<[^>]*>/g, "");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endPoint}/property`);
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${endPoint}/city`);
        const locationMap = response.data.reduce((map, location) => {
          map[location._id] = location.name;
          return map;
        }, {});
        setLocations(locationMap);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchData();
    fetchLocations();
  }, []);

  const getVisibleProperties = () => {
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = Math.min(startIndex + propertiesPerPage, properties.length);
    return properties.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber <= 0 || pageNumber > Math.ceil(properties.length / propertiesPerPage)) {
      return;
    }
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Property?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${endPoint}/property/${id}`);
      setProperties(properties.filter((property) => property._id !== id));
      toast.success("Property successfully deleted!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error deleting Property:", error.response?.data, error);
      toast.error(
        error.response?.data?.message || "Failed to delete Property. Please try again.",
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
      <div className="overflow-x-auto lg:mx-10 rounded-lg bg-white mt-10 mx-2">
        <ToastContainer /> 
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Details</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getVisibleProperties().map((property, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        {property.galleryImages.map((img, imgIndex) => (
                          <img key={imgIndex} src={img} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{property.name}</div>
                      <div className="text-sm opacity-50">
                        {locations[property.location] || "Unknown Location"}
                      </div>
                      <p>{formatDate(property?.created_at)}</p>
                    </div>
                  </div>
                </td>
                <td>{truncateText(stripHtmlTags(property.description), 20)}</td>
                <td>{property.priceRange}</td>
                <th className="flex gap-2">
                  <button className="btn btn-success text-white btn-xs" onClick={() => handleEdit(property)}>
                    Update
                  </button>
                  <button className="btn btn-error btn-xs text-white" onClick={() => handleDelete(property._id)}>
                    Delete
                  </button>
                  <button className="btn btn-info btn-xs text-white" >
                    View
                  </button>
                </th>
              </tr>
            ))}
            {properties.length === 0 && (
              <p className="p-5">No Property is available.</p>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {properties.length > propertiesPerPage && (
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
            disabled={currentPage === Math.ceil(properties.length / propertiesPerPage)}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default Properties;
