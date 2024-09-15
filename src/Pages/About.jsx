import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { endPoint } from '../../forAll/forAll';

const About = () => {
    const [aboutData, setAboutData] = useState({
        history: '',
        mission: '',
        vision: '',
        founder: '',
        founderLogo: null,
        locationMap: '',
        imagePublicId: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [existingAbout, setExistingAbout] = useState(null);

    useEffect(() => {
        axios.get(`${endPoint}/about`)
            .then(response => {
                if (response.data) {
                    setExistingAbout(response.data);
                    setAboutData({
                        ...response.data,
                        founderLogo: null // Reset file upload field
                    });
                    setIsUpdating(true);
                }
            })
            .catch(error => {
                console.error("There was an error fetching the about data!", error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAboutData({
            ...aboutData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setAboutData({
            ...aboutData,
            founderLogo: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(aboutData).forEach(key => {
            formData.append(key, aboutData[key]);
        });

        const url = isUpdating ? `${endPoint}/about/${existingAbout._id}` : `${endPoint}/about`;
        const method = isUpdating ? 'put' : 'post';

        axios({
            method: method,
            url: url,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                setExistingAbout(response.data);
                setIsUpdating(true);
                toast.success("About section saved successfully!", { position: "top-center" });
            })
            .catch(error => {
                console.error("There was an error saving the about section!", error);
                toast.error("There was an error saving the about section.", { position: "top-center" });
            });
    };

    return (
        <div className="p-6 bg-gray-100">
            <ToastContainer />
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold mb-6">{isUpdating ? 'Update About' : 'Add About'}</h2>
                
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">History</span>
                    </label>
                    <textarea  
                        name="history" 
                        value={aboutData.history} 
                        onChange={handleChange} 
                        required 
                        className="textarea textarea-bordered textarea-lg w-full p-4"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Mission</span>
                    </label>
                    <textarea  
                        name="mission" 
                        value={aboutData.mission} 
                        onChange={handleChange} 
                        required 
                        className="textarea textarea-bordered textarea-lg w-full p-4"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Vision</span>
                    </label>
                    <textarea  
                        name="vision" 
                        value={aboutData.vision} 
                        onChange={handleChange} 
                        required 
                        className="textarea textarea-bordered textarea-lg w-full p-4"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Founder</span>
                    </label>
                    <textarea 
                        type="text" 
                        name="founder" 
                        value={aboutData.founder} 
                        onChange={handleChange} 
                        required 
                        className="textarea textarea-bordered textarea-lg w-full"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Founder Image</span>
                    </label>
                    {existingAbout ? (
                        <img src={existingAbout?.founderLogo} alt="Founder Logo" className="mb-5" />
                    ) : (
                        <p className="mb-5">No image is uploaded.</p>
                    )}
                    <input 
                        type="file" 
                        name="founderLogo" 
                        onChange={handleFileChange} 
                        required={!isUpdating} 
                        className="file-input w-full"
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Location Map</span>
                    </label>
                    <input 
                        type="text" 
                        name="locationMap" 
                        value={aboutData.locationMap} 
                        onChange={handleChange} 
                        required 
                        className="input input-bordered"
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4">
                    {isUpdating ? 'Update About' : 'Add About'}
                </button>
            </form>
        </div>
    );
};

export default About;
