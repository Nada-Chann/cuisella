import React, { useState } from "react"
import { Link } from "react-router-dom"
import { FiBookOpen, FiHeart, FiPlusSquare, FiLogOut, FiSearch } from "react-icons/fi"
import logo from "../assets/logo.png"

const Navbar = ({ loggedInUser, setLoggedInUser }) => {
  const [searchQuery, setSearchQuery] = useState("")

 const handleLogout = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      credentials: "include"
    });
    localStorage.removeItem('auth_token');
    setLoggedInUser(null);
  } catch (err) {
    console.error("Logout failed:", err);
  }
}

  const handleSearch = (e) => {
    e.preventDefault()
  }

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/"><img src={logo} alt="logo" className="w-[90px]" /></Link>

          <form onSubmit={handleSearch} className="relative w-[350px]">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search" className="w-full pl-4 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDCEDF]" />
            <button type="submit" className="absolute right-3 top-2.5 text-[#F2BED1] hover:text-[#FDCEDF] transition" title="Search"><FiSearch size={18} /></button>
          </form>

          <div className="flex items-center space-x-8">
            {loggedInUser ? (
              <>
                <Link to="/my-recipes" title="My Recipes" className="text-gray-600 hover:text-[#F2BED1] text-xl"><FiBookOpen /></Link>
                <Link to="/favorites" title="Favorites" className="text-gray-600 hover:text-[#F2BED1] text-xl"><FiHeart /></Link>
                <Link to="/add-recipe" title="Add Recipe" className="text-gray-600 hover:text-[#F2BED1] text-xl"><FiPlusSquare /></Link>
                <button onClick={handleLogout} title="Logout" className="text-gray-600 hover:text-[#F2BED1] text-xl"><FiLogOut /></button>
              </>
            ) : (
              <Link to="/login" className="bg-[#FDCEDF] text-white px-4 py-1.5 rounded font-semibold hover:bg-[#F2BED1] transition">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navbar


