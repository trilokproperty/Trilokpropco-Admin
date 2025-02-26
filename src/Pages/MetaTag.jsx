import { useState, useEffect } from 'react';
import axios from 'axios';
import { endPoint } from '../../forAll/forAll'; // Ensure you have the correct API endpoint
import { toast, ToastContainer } from 'react-toastify';

const MetaTag = () => {
    const [metaData, setMetaData] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [existingMeta, setExistingMeta] = useState(null);

    // Fetch existing meta data on component load
    useEffect(() => {
        axios.get(`${endPoint}/meta`)
            .then(response => {
                if (response.data.length > 0) {
                    // console.log(response.data);
                    
                    setExistingMeta(response.data); // Assuming you want to update the first meta tag entry
                    setMetaData(
                        response.data
                        // image: null // Reset image field for file upload
                    );
                    setIsUpdating(true);
                }
            })
            .catch(error => {
                console.error("Error fetching the meta data!", error);
            });
    }, []);
    // Handle text field changes dynamically
const handleChange = (index, e) => {
    const { name, value } = e.target;

    setMetaData(prevMetaData =>
        prevMetaData.map((meta, i) =>
            i === index ? { ...meta, [name]: value } : meta
        )
    );
};

// Handle file upload changes dynamically
const handleFileChange = (index, e) => {
    const file = e.target.files[0];

    setMetaData(prevMetaData =>
        prevMetaData.map((meta, i) =>
            i === index ? { ...meta, image: file } : meta
        )
    );
};

// Handle form submission dynamically
const handleSubmit = (index, e) => {
    e.preventDefault();
    const selectedMeta = metaData[index]; // Get the form data for the specific index

    const formData = new FormData();
    formData.append("metaTitle", selectedMeta.metaTitle);
    formData.append("metaDescription", selectedMeta.metaDescription);

    // Conditionally append the image if uploaded
    if (selectedMeta.image) {
        formData.append("FeaturedImage", selectedMeta.image);
    }

    const url = isUpdating
        ? `${endPoint}/meta/update/${existingMeta[index]?._id}`
        : `${endPoint}/meta/add`;

    const method = isUpdating ? "put" : "post";

    axios({
        method: method,
        url: url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
    })
        .then((response) => {
            // Update the specific form's existingMeta state
            setExistingMeta((prev) => {
                const updatedMeta = [...prev];
                updatedMeta[index] = response.data;
                return updatedMeta;
            });
            setIsUpdating(true);
            toast.success("Meta tag saved successfully!", { position: "top-center" });
        })
        .catch((error) => {
            console.error("Error saving the meta tag!", error);
            toast.error("Error saving the meta tag.", { position: "top-center" });
        });
};

    

    

    return (
        <div className="p-6 bg-gray-100">
            <ToastContainer />
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metaData.map((metad, index) => (
    <form onSubmit={(e) => handleSubmit(index, e)} key={index} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold mb-6">
            {isUpdating ? `Update ${metad?.slug} Meta` : `Add ${metad?.slug} Meta`}
        </h2>

        <div className="form-control">
            <label className="label">
                <span className="label-text">Meta Title</span>
            </label>
            <input
                type="text"
                name="metaTitle"
                value={metad.metaTitle}
                onChange={(e) => handleChange(index, e)}
                required
                className="input input-bordered w-full"
            />
        </div>

        <div className="form-control">
            <label className="label">
                <span className="label-text">Meta Description</span>
            </label>
            <textarea
                name="metaDescription"
                value={metad.metaDescription}
                onChange={(e) => handleChange(index, e)}
                required
                className="textarea textarea-bordered textarea-lg w-full p-4"
            />
        </div>
        {metad.slug=="home" && ( 
        <div className="form-control">
            <label className="label">
                <span className="label-text">Featured Image</span>
            </label>
            {existingMeta[index]?.FeaturedImage ? (
                <img src={existingMeta[index]?.FeaturedImage} alt="Meta Featured" className="mb-5" />
            ) : (
                <p className="mb-5">No image uploaded.</p>
            )}
            <input
                type="file"
                name="image"
                onChange={(e) => handleFileChange(index, e)}
                className="file-input w-full"
            />
        </div>
        )}
        <button type="submit" className="btn btn-primary w-full mt-4">
            {isUpdating ? "Update Meta" : "Add Meta"}
        </button>
    </form>
))}

            </div>
        </div>
    );
    
};

export default MetaTag;
