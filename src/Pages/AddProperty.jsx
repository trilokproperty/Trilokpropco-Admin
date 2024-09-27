import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endPoint } from "../../forAll/forAll";
import { CustomSelectType } from "../Component/CustomSelect/CustomSelectType";
import { CustomSelectDeveloper } from "../Component/CustomSelect/CustomSelectDeveloper";
import { CustomSelectStatus } from "../Component/CustomSelect/CustomSelectStatus";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { useLocation } from "react-router-dom";
import DateInput from "../Component/DateInput";

const AddProperty = () => {
  const { state } = useLocation();
  const [propertyToEdit, setPropertyToEdit] = useState()
  const propertyToUpdate = state?.property;
  useEffect(() => {
    const fetchPropertyData = async () => {
        try {
            const response = await axios.get(`${endPoint}/property/${propertyToUpdate?._id}`);
            setPropertyToEdit(response.data);
        } catch (error) {
            console.error('Error fetching property data:', error);
        }
    };

    fetchPropertyData();
}, [propertyToUpdate]);
  console.log(propertyToEdit)
  const [formData, setFormData] = useState({
    name: "",
    metaTitle: "",
    metaDescription: "",
    type: "",
    developer: "",
    location: "",
    status: "",
    priceRange: "",
    configuration: "",
    size: "",
    galleryImages: [],
    bankImages: [],
    projectOverview: {
      possessionStart: "",
      landArea: "",
      configuration: "",
      flatArea: "",
      priceRange: "",
      numberOfBlocks: 0,
      elevation: "",
      numberOfUnits: 0,
      RegistrationNo: "",
    },
    description: "",
    priceDetails: [
      {
        configuration: "",
        price: "",
        size: "",
      },
    ],
    plans: [
      {
        planType: "",
        image: "",
        size: "",
        price: "",
      },
    ],
    pdfDownload: "",
    amenities: [],
    nearbyFacilities: "",
    locationMap: "",
    specifications: "",
    video: "",
    for: "",
    created_at:"",
    category:"",
    isFeatured:false,
    exclusive:false
  });

  console.log(formData)
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [typeData, setTypeData] = useState(null);
  const [amenitiesData, setAmenitiesData] = useState([]);
  const [statusData, setStatusData] = useState(null);
  const [developerData, setDeveloperData] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (propertyToEdit) {
      setFormData(propertyToEdit);

      if (propertyToEdit?.amenities && amenitiesData?.length) {
        const selectedAmenities = amenitiesData.filter(item => propertyToEdit.amenities.includes(item._id));
        console.log("Selected Amenities:", selectedAmenities);
        setSelectedAmenities(selectedAmenities);
      }

      const type = typeData?.find(item => item._id === propertyToEdit.typeId);
      setSelectedType(type);

      const developer = developerData?.find(item => item._id === propertyToEdit.developerId);
      setSelectedDeveloper(developer);

      const status = statusData?.find(item => item._id === propertyToEdit.statusId);
      setSelectedStatus(status);

      const location = cityData?.find(item => item._id === propertyToEdit.locationId);
      setSelectedLocation(location);
    }
  }, [propertyToEdit, typeData, developerData, statusData, cityData, amenitiesData]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          typeResponse,
          statusResponse,
          developerResponse,
          amenityResponse,
          cityResponse,
        ] = await Promise.all([
          axios.get(`${endPoint}/type`),
          axios.get(`${endPoint}/status`),
          axios.get(`${endPoint}/developer`),
          axios.get(`${endPoint}/amenity`),
          axios.get(`${endPoint}/city`),
        ]);
        setTypeData(typeResponse.data);
        setStatusData(statusResponse.data);
        setDeveloperData(developerResponse.data);
        setAmenitiesData(amenityResponse.data);
        setCityData(cityResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
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
  

  const handleNestedChange = (e, path) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const newState = { ...prevState };
      let currentLevel = newState;
      for (let i = 0; i < path.length - 1; i++) {
        currentLevel = currentLevel[path[i]];
      }
      currentLevel[path[path.length - 1]][name] = value;
      return newState;
    });
  };
  
  const imgbbUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`;
  
  const handleFileChange = async (event) => {
    const files = event.target.files;
    const uploadPromises = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("image", file);

        // Push each upload promise to the array
        uploadPromises.push(
          axios.post(`https://proxycors.com/${imgbbUrl}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        );
    }

    try {
        // Wait for all upload promises to resolve
        const responses = await Promise.all(uploadPromises);
        console.log(responses);
        // Extract the image URLs from responses
        const uploadedImages = responses.map(
            (response) => response.data.data.display_url
        );
        console.log(uploadedImages);
        // Update galleryImages in formData state
        setFormData((prevState) => ({
            ...prevState,
            galleryImages: [...prevState.galleryImages, ...uploadedImages],
        }));
        toast.success("Images uploaded successfully.", {
            position: "top-center",
        });
    } catch (error) {
        console.error("Error uploading images:", error);
        toast.error("Failed to upload images. Please try again.", {
            position: "top-center",
        });
    }
};


  const handleGalleryImageDelete = async (id, imageUrl) => {
    console.log(id, imageUrl)
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:5000/property/${id}/galleryImage`, {
        params: { imageUrl },
      });
       // Check if image was successfully deleted
       if (response.status === 200) {
        // Remove the deleted image from state
        setFormData(prevFormData => ({
            ...prevFormData,
            galleryImages: prevFormData.galleryImages.filter(img => img !== imageUrl)
        }));
        toast.success('Image successfully deleted.');
    }} catch (error) {
      toast.error('Error deleting image.');
      console.error('Error deleting image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBankImageDelete = async (id, imageUrl) => {
    console.log(id, imageUrl)
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:5000/property/${id}/bankImage`, {
        params: { imageUrl },
      });
       // Check if image was successfully deleted
       if (response.status === 200) {
        // Remove the deleted image from state
        setFormData(prevFormData => ({
            ...prevFormData,
            bankImages: prevFormData.bankImages.filter(img => img !== imageUrl)
        }));
        toast.success('Image successfully deleted.');
    }} catch (error) {
      toast.error('Error deleting image.');
      console.error('Error deleting image:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleFileChangeBank = async (event) => {
    const files = event.target.files;
    const uploadPromises = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("image", file);

      // Push each upload promise to the array
      uploadPromises.push(
        axios.post(`https://proxycors.com/${imgbbUrl}`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      })
      );
    }

    try {
      // Wait for all upload promises to resolve
      const responses = await Promise.all(uploadPromises);
      console.log(responses);
      // Extract the image URLs from responses
      const uploadedImages = responses.map(
        (response) => response.data.data.display_url
      );
      console.log(uploadedImages);
      // Update bankImages in formData state
      setFormData((prevState) => ({
        ...prevState,
        bankImages: [...prevState.bankImages, ...uploadedImages],
      }));
      toast.success("Images uploaded successfully.", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images. Please try again.", {
        position: "top-center",
      });
    }
  };

  const handlePlanFileChange = (e, index) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    axios.post(`https://proxycors.com/${imgbbUrl}`, formData, {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
  })
      .then((response) => {
        const imageUrl = response.data.data.url;
        toast.success("Image Successfully hosted.", {
          position: "top-center",
        });
        setFormData((prevState) => {
          const newState = { ...prevState };
          newState.plans[index].image = imageUrl;
          return newState;
        });
      })
      .catch((error) => {
        toast.error(`${error.response.data.error.message}`, {
          position: "top-left",
        });
        console.error("Error uploading image:", error);
      });
  };

  const handleAddPlan = () => {
    setFormData((prevState) => ({
      ...prevState,
      plans: [
        ...prevState.plans,
        { planType: "", image: "", size: "", price: "" },
      ],
    }));
  };

  const handleAddPriceDetail = () => {
    setFormData((prevState) => ({
      ...prevState,
      priceDetails: [
        ...prevState.priceDetails,
        { configuration: "", price: "", size: "" },
      ],
    }));
  };

  const handleRemovePlan = (index) => {
    setFormData((prevState) => {
      const newPlans = prevState.plans.filter((_, i) => i !== index);
      return {
        ...prevState,
        plans: newPlans,
      };
    });
  };

  const handleRemovePriceDetail = (index) => {
    setFormData((prevState) => {
      const newPriceDetails = prevState.priceDetails.filter(
        (_, i) => i !== index
      );
      return {
        ...prevState,
        priceDetails: newPriceDetails,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

     // Ensure that amenities are included in the formData
  const amenitiesIds = selectedAmenities.map(amenity => amenity._id);
  const updatedFormData = { ...formData, amenities: amenitiesIds };

  console.log(updatedFormData)

    try {
      const response = propertyToEdit
        ? await axios.put(`${endPoint}/property/${propertyToEdit._id}`, formData)
        : await axios.post(`${endPoint}/property`, updatedFormData);

        console.log(response)
      if (response.status === 200) {
        toast.success(`Property ${propertyToEdit ? "updated" : "added"} successfully!`, {
          position: "top-center",
        });
        setFormData({
          name: "",
          type: "",
          category:"",
          metaTitle:"",
          metaDescription:"",
          developer: "",
          location: "",
          status: "",
          priceRange: "",
          configuration: "",
          size: "",
          galleryImages: [],
          bankImages: [],
          projectOverview: {
            possessionStart: "",
            landArea: "",
            configuration: "",
            flatArea: "",
            priceRange: "",
            numberOfBlocks: 0,
            elevation: "",
            numberOfUnits: 0,
            RegistrationNo: "",
          },
          description: "",
          priceDetails: [
            {
              configuration: "",
              price: "",
              size: "",
            },
          ],
          plans: [
            {
              planType: "",
              image: "",
              size: "",
              price: "",
            },
          ],
          pdfDownload: "",
          amenities: [],
          nearbyFacilities: "",
          locationMap: "",
          specifications: "",
          video: "",
          for: "",
          isFeatured: false,
          exclusive:false,
          created_at:"",
        });
        setSelectedAmenities([]);
      } else {
        throw new Error("Failed to add/update property");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.response?.data?.error?.message || error?.message, { position: "top-center" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleAmenitySelect = (amenity) => {
  if (!selectedAmenities.find((a) => a._id === amenity._id)) {
    const updatedSelectedAmenities = [...selectedAmenities, amenity];
    setSelectedAmenities(updatedSelectedAmenities);
    setFormData((prevState) => ({
      ...prevState,
      amenities: updatedSelectedAmenities.map((a) => a._id), // Map to the IDs of the selected amenities
    }));
  } else {
    toast.error("Amenity already added!");
  }
};

const handleRemoveAmenity = (amenityId) => {
  const updatedSelectedAmenities = selectedAmenities.filter((amenity) => amenity._id !== amenityId);
  setSelectedAmenities(updatedSelectedAmenities);
  setFormData((prevState) => ({
    ...prevState,
    amenities: updatedSelectedAmenities.map((a) => a._id),
  }));
};

  AddProperty.modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  AddProperty.formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];
 const handleLocationChange = (e)=>{
  const selectedCityId = e.target.value;
  setFormData({
    ...formData,
    location: selectedCityId,
  })
 }

 const handleDateChange = (date) => {
  setFormData((prevState) => ({
    ...prevState,
    created_at: date,
  }));
};

  return (
    <div className="flex items-center justify-center flex-col gap-12 mx-1 relative overflow-hidden mb-10  md:p-5 p-2 lg:p-5">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">
        {propertyToEdit ? "Update Property" : "Add Property"}
      </h1>
      { loading &&
        <div className="bg-[#0000003e] absolute w-full h-full z-10 md:py-52 lg:px-96 py-36 md:px-32">
            <div className="modal-box" >
            <h3 className="font-bold text-lg flex gap-5">Loading.. 
            <span className="loading loading-ring loading-lg"></span></h3>
          <p className="py-4">Please wait untill it loaded.</p>
        </div>
        </div>
      }
      {/* Add Property Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 lg:w-3/4 w-full bg-white rounded-lg mt-10"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">Featured</span>
          </label>
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) => 
              setFormData((prevState) =>({
                ...prevState,
                isFeatured: e.target.checked
              }))
            }
            className="toggle toggle-primary"
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Exclusive</span>
          </label>
          <input
            type="checkbox"
            name="exclusive"
            checked={formData.exclusive}
            onChange={(e) => 
              setFormData((prevState) =>({
                ...prevState,
                exclusive: e.target.checked
              }))
            }
            className="toggle toggle-primary"
          />
        </div>

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
            <span className="label-text">Description</span>
          </label>
          <ReactQuill
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
            className="quill-editor h-96 md:mb-20 rounded-lg mb-32" // Add your own class for styling
            modules={AddProperty.modules}
            formats={AddProperty.formats}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Property For</span>
          </label>
          <select className="border p-4 rounded-lg" 
            value={formData.for}
            name="for"
            onChange={handleChange}
            required>
            <option>Property For?</option>
            <option value="Sale">Sale</option>
            <option value="Rent">Rent</option>
            <option value="Buy">Buy</option>
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Property Category</span>
          </label>
          <select className="border p-4 rounded-lg" 
            value={formData.category}
            name="category"
            onChange={handleChange}
            required>
            <option>Property Category?</option>
            <option value="residential">Residential Property</option>
            <option value="commercial">Commercial Property</option>
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Property Type</span>
          </label>
          <CustomSelectType
            options={typeData}
            selectedValue={formData?.type || selectedType}
            onSelect={(option) =>
              setFormData((prev) => ({ ...prev, type: option }))
            }
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Developer</span>
          </label>
          <CustomSelectDeveloper
            options={developerData}
            selectedValue={formData.developer || selectedDeveloper}
            onSelect={(option) =>
              setFormData((prev) => ({ ...prev, developer: option }))
            }
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <select className="border p-4 rounded-lg" 
            value={formData.location || selectedLocation}
            name="location"
            onChange={handleLocationChange}
            required>
            <option >Select a Location</option>
            {cityData?.map((city, index) => (<option key={index} value={city?._id}>{city?.name}</option>))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Status</span>
          </label>
          <CustomSelectStatus
            options={statusData}
            selectedValue={formData.status || selectedStatus}
            onSelect={(option) =>
              setFormData((prev) => ({ ...prev, status: option }))
            }
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Price Range</span>
          </label>
          <input
            type="text"
            name="priceRange"
            value={formData.priceRange}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Size</span>
          </label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Configuration</span>
          </label>
          <input
            type="text"
            name="configuration"
            value={formData.configuration}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Amenities</span>
          </label>
          <div className="grid lg:grid-cols-3 gap-5 sm:grid-cols-1 md:grid-cols-3">
            {amenitiesData.map((amenity) => (
              <div
                key={amenity._id}
                className="flex items-center border p-2 rounded w-max gap-2"
              >
                <img
                  src={amenity?.logo}
                  alt={amenity.name}
                  className="w-10 h-10 object-cover"
                />
                <span>{amenity.name}</span>
                <button
                  type="button"
                  onClick={() => handleAmenitySelect(amenity)}
                  className="btn btn-sm btn-outline"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-2xl mt-10">Selected Amenities:</h3>
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedAmenities.length === 0 ? (
                <p>No amenity selected.</p>
              ) : (
                selectedAmenities.map((amenity) => (
                  <div
                    key={amenity?._id}
                    className="flex items-center space-x-2 border p-2 rounded"
                  >
                    <img
                      src={amenity?.logo}
                      alt={amenity?.name}
                      className="w-10 h-10 object-cover"
                    />
                    <span>{amenity?.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(amenity?._id)}
                      className="ml-auto text-[#fc0000]"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Gallery Images (Upload one by one to maintain serial)</span>
          </label>
          <input
            type="file"
            name="galleryImages"
            
            onChange={(e) => handleFileChange(e, "galleryImages")}
            className="file-input w-full max-w-xs"
            multiple
          />
          <div className="flex gap-2 my-5">
          {
           formData?.galleryImages?.map((img, index) => (
            <div key={index} className="relative">
              <img className="w-[100px] h-[100px]" src={img} />
              {propertyToEdit && (
  <button
    type="button"
    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
    onClick={() => handleGalleryImageDelete(propertyToEdit._id, img)}
  >
    <FaTrash />
  </button>
)}


            </div>
           ))
          }
          </div>
        </div>

        {/* Nested Fields for Project Overview */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Project Overview</span>
          </label>
          <input
            type="text"
            name="possessionStart"
            value={formData?.projectOverview?.possessionStart}
            onChange={(e) => handleNestedChange(e, ["projectOverview"])}
            className="input input-bordered"
            placeholder="Possession Start"
          />
          <input
            type="text"
            name="landArea"
            value={formData?.projectOverview?.landArea}
            onChange={(e) => handleNestedChange(e, ["projectOverview"])}
            className="input input-bordered mt-2"
            placeholder="Land Area"
          />
          <input
            type="text"
            name="configuration"
            value={formData?.projectOverview?.configuration}
            onChange={(e) => handleNestedChange(e, ["projectOverview"])}
            className="input input-bordered mt-2"
            placeholder="Configuration"
          />
          <input
            type="text"
            name="flatArea"
            value={formData?.projectOverview?.flatArea}
            onChange={(e) => handleNestedChange(e, ["projectOverview"])}
            className="input input-bordered mt-2"
            placeholder="Flat Area"
          />
          <input
            type="text"
            name="priceRange"
            value={formData?.projectOverview?.priceRange}
            onChange={(e) => handleNestedChange(e, ["projectOverview"])}
            className="input input-bordered mt-2"
            placeholder="Price Range"
          />
          <input
            type="text"
            name="numberOfBlocks"
            value={formData?.projectOverview?.numberOfBlocks}
            onChange={(e) => handleNestedChange(e, ["projectOverview"])}
            className="input input-bordered mt-2"
            placeholder="Number Of Blocks"
          />
          <input
            type="text"
            name="elevation"
            value={formData?.projectOverview?.elevation}
            onChange={(e) => handleNestedChange(e, ["projectOverview"])}
            className="input input-bordered mt-2"
            placeholder="Elevation"
          />
          <input
            type="text"
            name="numberOfUnits"
            value={formData?.projectOverview?.numberOfUnits}
            onChange={(e) => handleNestedChange(e, ["projectOverview"])}
            className="input input-bordered mt-2"
            placeholder="Number Of Units"
          />
          <input
            type="text"
            name="RegistrationNo"
            value={formData?.projectOverview?.RegistrationNo}
            onChange={(e) => handleNestedChange(e, ["projectOverview"])}
            className="input input-bordered mt-2"
            placeholder="Registration Number"
          />
          {/* Add other fields of projectOverview similarly */}
        </div>

        {/* Nested Fields for Price Details */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Price Details</span>
          </label>
          {formData.priceDetails.map((priceDetail, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 flex-wrap gap-2 mt-4 border-b-2 pb-4"
            >
              <input
                type="text"
                name="configuration"
                value={priceDetail.configuration}
                onChange={(e) => handleNestedChange(e, ["priceDetails", index])}
                className="input input-bordered"
                placeholder="Configuration"
              />
              <input
                type="text"
                name="size"
                value={priceDetail.size}
                onChange={(e) => handleNestedChange(e, ["priceDetails", index])}
                className="input input-bordered"
                placeholder="Size"
              />
              <input
                type="text"
                name="price"
                value={priceDetail.price}
                onChange={(e) => handleNestedChange(e, ["priceDetails", index])}
                className="input input-bordered"
                placeholder="Price"
              />
              <button
                type="button"
                onClick={() => handleRemovePriceDetail(index)}
                className="text-[#fc0000]"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddPriceDetail}
            className="cursor-pointer mt-2 text-green-600"
          >
            Add More Price Details +
          </button>
        </div>

        {/* Nested Fields for Plans */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Plans</span>
          </label>
          {formData.plans.map((plan, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 flex-wrap gap-2 mt-4 border-b-2 pb-4"
            >
              <input
                type="text"
                name="planType"
                value={plan.planType}
                onChange={(e) => handleNestedChange(e, ["plans", index])}
                className="input input-bordered"
                placeholder="Plan Type"
              />
              <input
                type="file"
                name="image"
                onChange={(e) => handlePlanFileChange(e, index)}
                className="file-input w-full max-w-xs"
                placeholder="Image"
              />
              <input
                type="text"
                name="size"
                value={plan.size}
                onChange={(e) => handleNestedChange(e, ["plans", index])}
                className="input input-bordered"
                placeholder="Size"
              />
              <input
                type="text"
                name="price"
                value={plan.price}
                onChange={(e) => handleNestedChange(e, ["plans", index])}
                className="input input-bordered"
                placeholder="Price"
              />
              <img src={plan.image} className="h-[100px]" />
               <button
                type="button"
                onClick={() => handleRemovePlan(index)}
                className="text-[#fc0000]"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddPlan}
            className="cursor-pointer mt-2 text-green-600"
          >
            Add More Plans +
          </button>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">PDF Download</span>
          </label>
          <input
            type="text"
            name="pdfDownload"
            value={formData.pdfDownload}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Nearby Facilities</span>
          </label>
          <ReactQuill
            value={formData.nearbyFacilities}
            onChange={(value) =>
              setFormData({ ...formData, nearbyFacilities: value })
            }
            className="quill-editor h-20 mb-32 rounded-lg md:mb-20" 
            modules={AddProperty.modules}
            formats={AddProperty.formats}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Location Map</span>
          </label>
          <input
            type="text"
            name="locationMap"
            value={formData.locationMap}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Specifications</span>
          </label>
          <ReactQuill
            value={formData.specifications}
            onChange={(value) =>
              setFormData({ ...formData, specifications: value })
            }
            className="quill-editor h-20 mb-32 rounded-lg md:mb-20" 
            modules={AddProperty.modules}
            formats={AddProperty.formats}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Video</span>
          </label>
          <input
            type="text"
            name="video"
            value={formData.video}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <DateInput 
  isoDateString={formData.created_at} 
  onChange={handleDateChange} 
/>

          
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Bank Images (Upload one by one to maintain serial)</span>
          </label>
          <input
            type="file"
            name="bankImages"
            onChange={(e) => handleFileChangeBank(e, "bankImages")}
            className="file-input w-full max-w-xs"
            multiple
          />
          <div className="flex gap-2 my-5 flex-wrap">
          {
           formData?.bankImages?.map((img, index) => (<div key={index} className="relative">
            <img className="w-[100px] h-[100px]" src={img} />
            {propertyToEdit &&( <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                    onClick={() => handleBankImageDelete(propertyToEdit._id, img)}
                  >
                    <FaTrash />
              </button>)}
            </div>
           ))
          }
          </div>
        </div>
        <hr />
        <h3>FOR SEO</h3>
        <hr />
        <div className="form-control">
          <label className="label">
            <span className="label-text">Meta Title</span>
          </label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Meta Description</span>
          </label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            className="textarea textarea-bordered"
            required
          />
        </div>
        <button
         type="submit"
         disabled={loading}
         className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:bg-gray-400"
       >
     {loading ? "Saving..." : propertyToEdit ? "Update Property" : "Add Property"}
    </button>
      </form>
    </div>
  );
};

export default AddProperty;
