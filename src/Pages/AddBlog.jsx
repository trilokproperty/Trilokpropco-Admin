import axios from "axios";
import { endPoint } from "../../forAll/forAll";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useLocation } from "react-router-dom";
import DateInput from "../Component/DateInput";

const AddBlog = () => {
  const { state } = useLocation();
  const [blogToEdit, setBlogToEdit] = useState(null);
  const blogToUpdate = state?.blog;
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (blogToUpdate?._id) {
        try {
          const response = await axios.get(
            `${endPoint}/blog/${blogToUpdate?._id}`
          );
          setBlogToEdit(response.data);
        } catch (error) {
          console.error("Error fetching blog data:", error);
        }
      }
    };

    fetchBlogData();
  }, [blogToUpdate]);

  useEffect(() => {
    if (blogToEdit) {
      setFormData({
        title: blogToEdit?.title || "",
        description: blogToEdit.description || "",
        category: selectedCategory || "",
        date: blogToEdit?.date,
        _id: blogToEdit._id, // Keep track of the blog ID in formData
        image: blogToEdit.image || "",
      });
      setSelectedCategory(blogToEdit.category || "");
    }
  }, [blogToEdit, selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${endPoint}/blogCategory`);
        setCategories(response.data);

        if (blogToEdit && blogToEdit.category) {
          const blogCategory = response.data.find(
            (item) => item._id === blogToEdit.category
          );
          setSelectedCategory(blogCategory);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [blogToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("category", formData.category);
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      console.log(formData, data);
      const response = blogToEdit
        ? await axios.put(`${endPoint}/blog/${blogToEdit._id}`, data, {
            "Content-type": "multipart/form-data",
          })
        : await axios.post(`${endPoint}/blog`, data, {
            "Content-type": "multipart/form-data",
          });
      console.log(response.data);

      if (response.status === 200) {
        toast.success(
          `Blog ${blogToEdit ? "updated" : "added"} successfully!`,
          {
            position: "top-center",
          }
        );
        setLoading(false);
        // Optionally, you can reset the form or redirect the user here
      }
    } catch (error) {
      console.error("Error submitting form:", error.response.data, error);
      setLoading(false);
      toast.error(
        error.response.data.message || "Failed to add blog. Please try again.",
        {
          position: "top-center",
        }
      );
    }
  };

  AddBlog.modules = {
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

  AddBlog.formats = [
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
  const handleDateChange = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      date: date,
    }));
  };

  return (
    <div className="flex items-center justify-center flex-col gap-12 mx-1 relative overflow-hidden pb-10">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-2">
        {blogToEdit ? "Update Blog" : "Add Blog"}
      </h1>
      {loading && (
        <div className="bg-[#0000003e] absolute w-full h-full z-10 md:py-52 lg:px-96 py-36 md:px-32">
          <div className="modal-box">
            <h3 className="font-bold text-lg flex gap-5">
              Loading..
              <span className="loading loading-ring loading-lg"></span>
            </h3>
            <p className="py-4">Please wait until it loads.</p>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 lg:w-3/4 w-full bg-white rounded-lg mt-10"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">Blog Category</span>
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option disabled value="">
              Select category
            </option>
            {categories?.map((category) => (
              <option key={category?._id} value={category?._id}>
                {category?.category || selectedCategory.category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Blog Title</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Featured Image</span>
          </label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="file-input w-full max-w-xs"
          />
          {formData.image && (
            <img
              className="w-[100px] h-[100px] my-5"
              src={formData.image}
              alt="Featured"
            />
          )}
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
            className="quill-editor h-96 md:mb-20 rounded-lg mb-32 text-xl"
            modules={AddBlog.modules}
            formats={AddBlog.formats}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Date</span>
          </label>
          <DateInput
            isoDateString={formData.date}
            onChange={handleDateChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {loading ? "Saving..." : blogToEdit ? "Update Blog" : "Add Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
