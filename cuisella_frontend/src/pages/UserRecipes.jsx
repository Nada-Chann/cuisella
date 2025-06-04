import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiEye, FiClock, FiUsers } from 'react-icons/fi';


const UserRecipes = ({ loggedInUser }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://localhost:8000/api/user/recipes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }

      // Remove the deleted recipe from state
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#F2BED1]">My Recipes</h1>
        <Link 
          to="/add-recipe" 
          className="bg-[#FDCEDF] text-white px-4 py-2 rounded font-semibold hover:bg-[#F2BED1] transition"
        >
          Add New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't created any recipes yet.</p>
          <Link 
            to="/add-recipe" 
            className="text-[#FDCEDF] hover:text-[#F2BED1] font-medium"
          >
            Create your first recipe →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {recipe.image_path && (
                <img 
                  src={`http://localhost:8000/storage/${recipe.image_path}`} 
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <span className="text-sm text-gray-500">
                      <FiClock className="inline mr-1" /> {recipe.time}
                    </span>
                    <span className="text-sm text-gray-500">
                      <FiUsers className="inline mr-1" /> {recipe.servings} servings
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      to={`/recipes/${recipe.id}`} 
                      className="text-gray-600 hover:text-[#F2BED1]"
                      title="View Details"
                    >
                      <FiEye size={18} />
                    </Link>
                    <Link 
                      to={`/edit-recipe/${recipe.id}`} 
                      className="text-gray-600 hover:text-[#F2BED1]"
                      title="Edit"
                    >
                      <FiEdit size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(recipe.id)} 
                      className="text-gray-600 hover:text-red-500"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRecipes;