import React from "react"
import { FaBookOpen, FaUserFriends, FaStar } from "react-icons/fa"
import { Link } from "react-router-dom"

const stats = [
  { label: "Recipes to explore", value: "", icon: <FaBookOpen className="text-[#FDCEDF]" /> },
  { label: "Active home cooks", value: "", icon: <FaUserFriends className="text-[#FDCEDF]" /> },
  { label: "Average recipe rating", value: "", icon: <FaStar className="text-[#FDCEDF]" /> }
]

const Home = ({ loggedInUser }) => {
  return (
    <div className="bg-[#F8E8EE] min-h-screen px-8 pt-30 pb-10">
      <section className="text-center py-10">
        <h1 className="text-4xl font-bold text-black">Discover & Share</h1>
        <h2 className="text-4xl font-bold text-[#F2BED1] mt-1">Delicious Recipes</h2>
        <p className="text-[#333] font-[sans-serif] max-w-xl mx-auto mt-4">Join our sweet community of food lovers! Share your favorite recipes, discover new dishes, and connect with passionate cooks from around the world.</p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-[#FDCEDF] font-bold text-white px-6 py-2 rounded-md hover:bg-[#F2BED1] transition">Get Started</button>
          <button className="bg-white border font-bold border-[#FDCEDF] text-[#F2BED1] px-6 py-2 rounded-md hover:bg-[#FDCEDF] hover:text-white transition">Browse Recipes</button>
        </div>
      </section>
      <section className="text-center py-10">
        <div className="flex justify-center gap-12 flex-wrap">
          {stats.map(stat => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-md mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-[#F2BED1]">{stat.value}</div>
              <div className="text-[#333]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-10">
        <h2 className="text-2xl font-bold text-[#F2BED1] text-center mb-6">Other users recipes</h2>
        {!loggedInUser && (
          <div className="text-center mt-8">
            <p className="mb-4">Want to see more? Join our community!</p>
            <Link to="/login" className="bg-[#FDCEDF] font-bold text-white px-6 py-2 rounded-md hover:bg-[#F2BED1] transition">Sign In</Link>
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
