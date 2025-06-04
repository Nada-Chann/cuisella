import React, { useState, useRef } from "react"
import { FiBookOpen, FiClock, FiUsers, FiEdit, FiList, FiImage } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const AddRecipe = () => {
  const [form, setForm] = useState({ title: "", description: "", time: "", servings: "", ingredients: "", steps: "", image: null })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) setForm((prev) => ({ ...prev, image: file }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsSubmitting(true);
  
  try {
    // 1. Get the auth token from localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error("You need to be logged in to add a recipe");
    }

    // 2. Get CSRF token first (required for Sanctum)
    const csrfResponse = await fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!csrfResponse.ok) {
      throw new Error("Failed to establish secure session");
    }

    // 3. Prepare the form data
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

    // 4. Make the request with authentication
    const res = await fetch("http://localhost:8000/api/recipes", {
      method: "POST",
      credentials: "include", // Important for cookies/sessions
      headers: {
        'Authorization': `Bearer ${token}`, // Include the auth token
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: formData // FormData will automatically set Content-Type
    });

    // 5. Handle response
    if (!res.ok) {
      const errorData = await res.json();
      const errorMsg = errorData.errors 
        ? Object.values(errorData.errors).flat().join(", ") 
        : errorData.message || "Recipe submission failed";
      throw new Error(errorMsg);
    }

    // 6. Success - navigate to my recipes
    navigate("/my-recipes");
    
  } catch (err) {
    setError(err.message);
    console.error("Recipe submission error:", err);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="max-w-md mx-auto mt-32 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-center text-2xl font-bold text-[#F2BED1] mb-6">Add New Recipe</h1>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Image (Optional)</label>
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
          Add
        </button>
      </form>
    </div>
  )
}

export default AddRecipe