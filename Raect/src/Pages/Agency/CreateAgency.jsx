import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext"

const CreateAgency = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "sddqsd",
    registration_number: "dsqsd",
    email: "sqdqs@gmail.com",
    phone: "sqdqsd",
    agency_coordinates: { lat: 10, lng: -8.05 },
    description: "sqdqsdqsdqsdsfdsfsdfds",
    logo_path: null,
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email format";
        break;
      case "phone":
        if (!/^\+?[\d\s-]{7,15}$/.test(value)) return "Invalid phone number";
        break;
      case "lat":
      case "lng":
        if (isNaN(Number(value))) return "Must be a number";
        if (name === "lat" && (value < -90 || value > 90))
          return "Latitude must be between -90 and 90";
        if (name === "lng" && (value < -180 || value > 180))
          return "Longitude must be between -180 and 180";
        break;
      case "name":
      case "registration_number":
        if (!value.trim()) return "This field is required";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Clear previous error
    setErrors(prev => ({ ...prev, [name]: "" }));

    if (name === "logo_path") {
      setFormData(prev => ({ ...prev, logo_path: files[0] }));
    }
    else if (name === "lat" || name === "lng") {
      setFormData(prev => ({
        ...prev,
        agency_coordinates: {
          ...prev.agency_coordinates,
          [name]: value
        }
      }));

      // Validate coordinates in real-time
      const error = validateField(name, value);
      if (error) setErrors(prev => ({ ...prev, [name]: error }));
    }
    else if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("registration_number", formData.registration_number);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("description", formData.description || "");
    payload.append("is_active", formData.is_active ? "1" : "0");

    // Flatten coordinates
    payload.append("agency_coordinates", JSON.stringify(formData.agency_coordinates));

    // Add file if available
    if (formData.logo_path) {
      payload.append("logo_path", formData.logo_path);
    }


    try {
      const response = await fetch("/api/agencies", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,

        },
        body: payload,
      });

      const result = await response.json();

      if (!response.ok) {
        setErrors(prev => ({
          ...prev,
          ...result.errors,
          form: result.message || "Validation failed",
        }));
        return;
      }

      navigate("/manager")
    } catch (error) {
      console.error("Submission error:", error);
      setErrors(prev => ({ ...prev, form: error.message }));
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Create New Agency</h1>
          <p className="opacity-80">Fill in your agency details below</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 space-y-6"
          encType="multipart/form-data"
        >
          {errors.form && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              {errors.form}
            </div>
          )}



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Agency Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="Acme Travel Agency"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Registration Number *
              </label>
              <input
                type="text"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.registration_number ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="123-456-789"
              />
              {errors.registration_number && (
                <p className="text-red-500 text-sm mt-1">{errors.registration_number}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="contact@agency.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Location Coordinates
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-gray-500 mr-2">Latitude:</span>
                  {errors.lat && (
                    <span className="text-red-500 text-sm">{errors.lat}</span>
                  )}
                </div>
                <input
                  type="text"
                  name="lat"
                  value={formData.agency_coordinates.lat}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.lat ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="34.0522"
                />
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <span className="text-gray-500 mr-2">Longitude:</span>
                  {errors.lng && (
                    <span className="text-red-500 text-sm">{errors.lng}</span>
                  )}
                </div>
                <input
                  type="text"
                  name="lng"
                  value={formData.agency_coordinates.lng}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.lng ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  placeholder="-118.2437"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe your agency services and specialties..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Agency Logo
              </label>
              <div className="flex items-center">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                    </svg>
                    <p className="text-sm text-gray-500">
                      {formData.logo_path
                        ? formData.logo_path.name
                        : "Click to upload logo"}
                    </p>
                  </div>
                  <input
                    type="file"
                    name="logo_path"
                    onChange={handleChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="relative inline-block w-12 h-6 mr-3">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="absolute w-12 h-6 transition-colors duration-300 rounded-full appearance-none cursor-pointer peer bg-gray-300 checked:bg-indigo-600"
                  />
                  <span className="absolute w-5 h-5 transition-transform duration-300 bg-white rounded-full left-1 top-0.5 peer-checked:translate-x-6"></span>
                </div>
                <label className="text-gray-700 font-medium">
                  Active Agency
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Agency...
                </div>
              ) : (
                "Create Agency"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAgency;