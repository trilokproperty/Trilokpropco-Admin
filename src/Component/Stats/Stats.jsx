import { FaConnectdevelop } from "react-icons/fa";
import { LuTableProperties } from "react-icons/lu";
import { RiBloggerLine, RiContactsLine } from "react-icons/ri";

const Stats = ({propertiesData, developerData, blogData, formData}) => {
    console.log(propertiesData?.length, developerData?.length, formData?.length)
    return (
    <div className="grid lg:grid-cols-4 gap-3 md:grid-cols-2">
        <div className="bg-white p-6 w-[250px] rounded-lg stats-card">
            <div className="flex items-center justify-between">
                <p>Properties</p>
                <div className="bg-[#d8d8d8] p-2 rounded-lg"><LuTableProperties /></div>
            </div>
            <div>
                <h2 className="text-3xl font-bold">{propertiesData?.length || 0} </h2>
                <p><span className="text-green-600">total</span> properties so far</p>
            </div>
        </div>   

        <div className="bg-white p-6 w-[250px] rounded stats-card">
            <div className="flex items-center justify-between">
                <p>Developers</p>
                <div className="bg-[#d8d8d8] p-2 rounded-lg"><FaConnectdevelop /></div>
            </div>
            <div>
                <h2 className="text-3xl font-bold">{developerData?.length|| 0}</h2>
                <p><span className="text-green-600">total</span> developers</p>
            </div>
        </div> 

        <div className="bg-white p-6 w-[250px] rounded stats-card">
            <div className="flex items-center justify-between">
                <p>Inquires</p>
                <div className="bg-[#d8d8d8] p-2 rounded-lg"><RiContactsLine /></div>
            </div>
            <div>
                <h2 className="text-3xl font-bold">{formData?.length || 0}</h2>
                <p><span className="text-green-600">total</span> inquires.</p>
            </div>
        </div> 

        <div className="bg-white p-6 w-[250px] rounded stats-card">
            <div className="flex items-center justify-between">
                <p>Blogs</p>
                <div className="bg-[#d8d8d8] p-2 rounded-lg"><RiBloggerLine/></div>
            </div>
            <div>
                <h2 className="text-3xl font-bold">{blogData?.length|| 0}</h2>
                <p><span className="text-green-600">total</span> posted blogs.</p>
            </div>
        </div>  
    </div>
    );
};

export default Stats;