import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiClock, FiUsers, FiEdit, FiList, FiImage } from 'react-icons/fi';

const EditRecipe = ({ loggedInUser }) => {
  const { id } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    time: "",
    servings: "",
    ingredients: "",
    steps: "",
    image: null
  });
  const [currentImage, setCurrentImage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`http://localhost:8000/api/recipes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to fetch recipe');

        const data = await response.json();
        setForm({
          title: data.title,
          description: data.description,
          time: data.time,
          servings: data.servings,
          ingredients: data.ingredients.join("\n"),
          steps: data.steps.join("\n"),
          image: null
        });
        if (data.image_path) {
          setCurrentImage(`http://localhost:8000/storage/${data.image_path}`);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        credentials: "include"
      });

      const ingredientsArray = form.ingredients.split("\n").filter(i => i.trim());
      const stepsArray = form.steps.split("\n").filter(i => i.trim());

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("time", form.time);
      formData.append("servings", form.servings);
      formData.append("ingredients", JSON.stringify(ingredientsArray));
      formData.append("steps", JSON.stringify(stepsArray));
      if (form.image) {
        formData.append("image", form.image);
      }
      formData.append("_method", "PUT");

      const res = await fetch(`http://localhost:8000/api/recipes/${id}`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: "include",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        const msg = errorData.errors
          ? Object.values(errorData.errors).flat().join(", ")
          : errorData.message || "Recipe update failed";
        throw new Error(msg);
      }

      navigate("/my-recipes");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-center text-2xl font-bold text-[#F2BED1] mb-6">Edit Recipe</h1>
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="relative mb-4">
          <FiBookOpen className="absolute left-3 top-3 text-[#F2BED1]" />
          <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Recipe Title" className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-[#FDCEDF]" required />
        </div>
        <div className="relative mb-4">
          <FiEdit className="absolute left-3 top-3 text-[#F2BED1]" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-[#FDCEDF] h-24 resize-none" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Image</label>
          {currentImage && <img src={currentImage} alt="Current" className="w-full h-48 object-cover mb-2 rounded" />}
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => fileInputRef.current.click()} className="flex items-center px-4 py-2 border border-[#F2BED1] rounded-md text-sm font-medium text-[#F2BED1] bg-white hover:bg-[#F8E8EE]">
              <FiImage className="mr-2" />
              {form.image ? "Change Image" : "Select Image"}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
          </div>
        </div>
        <div className="relative mb-4">
          <FiClock className="absolute left-3 top-3 text-[#F2BED1]" />
          <input type="text" name="time" value={form.time} onChange={handleChange} placeholder="Time (e.g., 30 min)" className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-[#FDCEDF]" />
        </div>
        <div className="relative mb-4">
          <FiUsers className="absolute left-3 top-3 text-[#F2BED1]" />
          <input type="number" name="servings" value={form.servings} onChange={handleChange} placeholder="Servings" min="1" className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-[#FDCEDF]" />
        </div>
        <div className="relative mb-4">
          <FiList className="absolute left-3 top-3 text-[#F2BED1]" />
          <textarea name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="Ingredients (one per line)" className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-[#FDCEDF] h-24 resize-none" required />
        </div>
        <div className="relative mb-6">
          <FiList className="absolute left-3 top-3 text-[#F2BED1]" />
          <textarea name="steps" value={form.steps} onChange={handleChange} placeholder="Steps (one per line)" className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-[#FDCEDF] h-24 resize-none" required />
        </div>
        <button type="submit" disabled={isSubmitting} className={`w-full py-2 bg-[#FDCEDF] text-white font-bold rounded hover:bg-[#F2BED1] transition ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}>
          {isSubmitting ? "Updating..." : "Update Recipe"}
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
