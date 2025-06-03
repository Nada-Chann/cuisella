import React, { useState } from "react"
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

const API_BASE_URL = "http://localhost:8000/api"

const LoginRegister = ({ setLoggedInUser }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ name: "", email: "", password: "", password_confirmation: "" })
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleToggle = () => {
    setIsLogin(!isLogin)
    setError("")
    setFormData({ name: "", email: "", password: "", password_confirmation: "" })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const getCsrf = async () => {
    try {
      await fetch("http://localhost:8000/sanctum/csrf-cookie", { credentials: "include" })
    } catch {
      throw new Error("Failed to get CSRF token")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!isLogin && formData.password !== formData.password_confirmation) {
      setError("Passwords don't match")
      setIsLoading(false)
      return
    }

    try {
      await getCsrf()
      const url = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`
      const body = isLogin ? { email: formData.email, password: formData.password } : formData

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.errors?.email?.[0] || data.errors?.password?.[0] || "Something went wrong")
      }

      if (isLogin) {
        if (data.access_token) {
          localStorage.setItem("auth_token", data.access_token)
        }

        if (!data.user) {
          const userResponse = await fetch(`${API_BASE_URL}/user`, {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${data.access_token}`,
              Accept: "application/json"
            }
          })
          const userData = await userResponse.json()
          setLoggedInUser(userData)
        } else {
          setLoggedInUser(data.user)
        }

        navigate("/")
      } else {
        alert("Registration successful! Please login.")
        setIsLogin(true)
        setFormData({ ...formData, password: "", password_confirmation: "" })
      }
    } catch (err) {
      setError(err.message || "An error occurred during authentication")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-32 bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-center text-2xl font-bold text-[#F2BED1] mb-6">Welcome to Cuisella</h1>
      <div className="flex mb-6 space-x-4">
        <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 font-semibold rounded ${isLogin ? "bg-[#FDCEDF] text-white" : "border border-[#FDCEDF] text-[#F2BED1]"}`}>Login</button>
        <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 font-semibold rounded ${!isLogin ? "bg-[#FDCEDF] text-white" : "border border-[#FDCEDF] text-[#F2BED1]"}`}>Register</button>
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && <div className="relative mb-4"><FiUser className="absolute left-3 top-3 text-[#F2BED1]" /><input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-[#FDCEDF]" required minLength={3} /></div>}
        <div className="relative mb-4"><FiMail className="absolute left-3 top-3 text-[#F2BED1]" /><input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-[#FDCEDF]" required /></div>
        <div className="relative mb-4"><FiLock className="absolute left-3 top-3 text-[#F2BED1]" /><input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="Password" className="w-full pl-10 pr-10 py-2 border rounded focus:ring-2 focus:ring-[#FDCEDF]" required minLength={isLogin ? 1 : 8} /><button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-3 text-[#F2BED1]">{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>
        {!isLogin && <div className="relative mb-6"><FiLock className="absolute left-3 top-3 text-[#F2BED1]" /><input name="password_confirmation" type={showPassword ? "text" : "password"} value={formData.password_confirmation} onChange={handleChange} placeholder="Confirm Password" className="w-full pl-10 pr-10 py-2 border rounded focus:ring-2 focus:ring-[#FDCEDF]" required minLength={8} /></div>}
        <button type="submit" disabled={isLoading} className={`w-full py-2 bg-[#FDCEDF] text-white font-bold rounded hover:bg-[#F2BED1] transition ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}>{isLoading ? "Processing..." : isLogin ? "Login" : "Register"}</button>
      </form>
    </div>
  )
}

export default LoginRegister