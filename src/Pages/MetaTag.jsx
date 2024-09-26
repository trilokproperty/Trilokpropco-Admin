import { useState, useEffect } from 'react';
import axios from 'axios';
import { endPoint } from '../../forAll/forAll'; // Ensure you have the correct API endpoint
import { toast, ToastContainer } from 'react-toastify';

const MetaTag = () => {
    const [metaData, setMetaData] = useState({
        metaTitle: '',
        metaDescription: '',
        image: null, // This will store the selected image file for upload
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [existingMeta, setExistingMeta] = useState(null);

    // Fetch existing meta data on component load
    useEffect(() => {
        axios.get(`${endPoint}/meta`)
            .then(response => {
                if (response.data.length > 0) {
                    setExistingMeta(response.data[0]); // Assuming you want to update the first meta tag entry
                    setMetaData({
                        ...response.data[0],
                        image: null // Reset image field for file upload
                    });
                    setIsUpdating(true);
                }
            })
            .catch(error => {
                console.error("Error fetching the meta data!", error);
            });
    }, []);

    // Handle text field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMetaData({
            ...metaData,
            [name]: value
        });
    };

    // Handle file upload changes
    const handleFileChange = (e) => {
        setMetaData({
            ...metaData,
            image: e.target.files[0] // Store the selected file for later upload
        });
    };

    // Handle form submission (Add or Update)
    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        
        // Append other fields to FormData
        formData.append('metaTitle', metaData.metaTitle);
        formData.append('metaDescription', metaData.metaDescription);
    
        // Conditionally append the image if it's been updated
        if (metaData.image) {
            formData.append('FeaturedImage', metaData.image);
        }
    
        const url = isUpdating ? `${endPoint}/meta/update/${existingMeta._id}` : `${endPoint}/meta/add`;
        const method = isUpdating ? 'put' : 'post';
    
        axios({
            method: method,
            url: url,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
            setExistingMeta(response.data);
            setIsUpdating(true);
            toast.success("Meta tag saved successfully!", { position: "top-center" });
        })
        .catch(error => {
            console.error("Error saving the meta tag!", error);
            toast.error("Error saving the meta tag.", { position: "top-center" });
        });
    };
    

    return (
        <div className="p-6 bg-gray-100">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold mb-6">{isUpdating ? 'Update Meta Tag' : 'Add Meta Tag'}</h2>
                
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Meta Title</span>
                    </label>
                    <input 
                        type="text" 
                        name="metaTitle" 
                        value={metaData.metaTitle} 
                        onChange={handleChange} 
                        required 
                        className="input input-bordered"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Meta Description</span>
                    </label>
                    <textarea  
                        name="metaDescription" 
                        value={metaData.metaDescription} 
                        onChange={handleChange} 
                        required 
                        className="textarea textarea-bordered textarea-lg w-full p-4"
                    />
                </div>
                
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Featured Image</span>
                    </label>
                    {existingMeta && existingMeta.FeaturedImage ? (
                        <img src={existingMeta?.FeaturedImage} alt="Meta Featured" className="mb-5" />
                    ) : <p className="mb-5">No image is uploaded.</p>}
                    <input 
                        type="file" 
                        name="image" 
                        onChange={handleFileChange} 
                        required={!isUpdating} 
                        className="file-input w-full"
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4">
                    {isUpdating ? 'Update Meta Tag' : 'Add Meta Tag'}
                </button>
            </form>
        </div>
    );
};

export default MetaTag;
