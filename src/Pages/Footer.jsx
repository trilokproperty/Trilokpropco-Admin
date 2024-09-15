import { useState, useEffect } from 'react';
import axios from 'axios';
import { endPoint } from '../../forAll/forAll';
import { toast, ToastContainer } from 'react-toastify';

const Footer = () => {
    const [footerData, setFooterData] = useState({
        description: '',
        image: null,
        facebook: '',
        instagram: '',
        youtube: '',
        linkedin: '',
        whatsapp: '',
        twitter: '',
        email: '',
        contact: '',
        location: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [existingFooter, setExistingFooter] = useState(null);

    useEffect(() => {
        axios.get(`${endPoint}/footer`)
            .then(response => {
                if (response.data.length > 0) {
                    setExistingFooter(response.data[0]);
                    setFooterData({
                        ...response.data[0],
                        image: null // Reset image field for file upload
                    });
                    setIsUpdating(true);
                }
            })
            .catch(error => {
                console.error("There was an error fetching the footer data!", error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFooterData({
            ...footerData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFooterData({
            ...footerData,
            image: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.keys(footerData).forEach(key => {
            formData.append(key, footerData[key]);
        });

        const url = isUpdating ? `${endPoint}/footer/${existingFooter._id}` : `${endPoint}/footer`;
        const method = isUpdating ? 'put' : 'post';

        axios({
            method: method,
            url: url,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                setExistingFooter(response.data);
                setIsUpdating(true);
                toast.success("Footer saved successfully!", { position: "top-center" });
            })
            .catch(error => {
                console.error("There was an error saving the footer!", error);
                toast.error("There was an error saving the footer.", { position: "top-center" });
            });
    };

    return (
        <div className="p-6 bg-gray-100">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold mb-6">{isUpdating ? 'Update Footer' : 'Add Footer'}</h2>
                
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Description</span>
                    </label>
                    <textarea  
                        name="description" 
                        value={footerData.description} 
                        onChange={handleChange} 
                        required 
                        className="textarea textarea-bordered textarea-lg w-full p-4"
                    />
                </div>
                
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Footer Image</span>
                    </label>
                    {existingFooter ?
                    <img src={existingFooter?.image} alt="Footer" className="mb-5" /> :<p className="mb-5" >No image is uploaded.</p>}
                    <input 
                        type="file" 
                        name="image" 
                        onChange={handleFileChange} 
                        required={!isUpdating} 
                        className="file-input w-full"
                    />
                </div>
                
                {['facebook', 'instagram', 'youtube', 'linkedin', 'whatsapp', 'twitter', 'email', 'contact', 'location'].map((field) => (
                    <div key={field} className="form-control">
                        <label className="label">
                            <span className="label-text capitalize">{field}</span>
                        </label>
                        <input 
                            type={field === 'email' ? 'email' : 'text'} 
                            name={field} 
                            value={footerData[field]} 
                            onChange={handleChange} 
                            required 
                            className="input input-bordered"
                        />
                    </div>
                ))}
                
                <button type="submit" className="btn btn-primary w-full mt-4">
                    {isUpdating ? 'Update Footer' : 'Add Footer'}
                </button>
            </form>
        </div>
    );
};

export default Footer;
