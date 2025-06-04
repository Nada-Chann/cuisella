import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiBookOpen, FiClock, FiUsers, FiList, FiImage, FiEdit3 } from "react-icons/fi";

const ViewRecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`http://localhost:8000/api/recipes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }

        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) {
    return <div className="mt-32 text-center text-red-600 font-medium">{error}</div>;
  }

  if (!recipe) {
    return <div className="mt-32 text-center text-gray-600">Loading recipe...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-32 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-center text-3xl font-bold text-[#F2BED1] mb-6 flex items-center justify-center gap-2">
        <FiBookOpen /> {recipe.title}
      </h1>

      {recipe.image_path && (
        <img
          src={`http://localhost:8000/storage/${recipe.image_path}`}
          alt={recipe.title}
          className="w-full h-64 object-cover mb-6 rounded"
        />
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-[#FDCEDF] mb-2 flex items-center gap-2">
          <FiEdit3 /> Description
        </h2>
        <p className="text-gray-700">{recipe.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-700">
          <FiClock className="text-[#F2BED1]" />
          <span>{recipe.time}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <FiUsers className="text-[#F2BED1]" />
          <span>{recipe.servings} serving(s)</span>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-[#FDCEDF] mb-2 flex items-center gap-2">
          <FiList /> Ingredients
        </h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {recipe.ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold text-[#FDCEDF] mb-2 flex items-center gap-2">
          <FiList /> Steps
        </h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-1">
          {recipe.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default ViewRecipeDetails;
