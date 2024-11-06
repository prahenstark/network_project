"use client";
import React, { useState } from "react";
import axios from "axios";
import { fetchDashboardInfo } from "@/lib/api";

function CreateAccountForm({ onClose }) {
  const [formData, setFormData] = useState({
    account: "",
    nickName: "",
    password: "",
    mobile: "",
    email: "",
    role: "",
    status: "",
    bindingProject: {
      proj1: false,
      proj2: false,
      proj3: false,
    },
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        bindingProject: {
          ...prevData.bindingProject,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare data for API
    const apiData = {
      role: formData.role === "admin" ? "2" : "1",
      enable: formData.status === "enable" ? "1" : "0",
      gids: ["cnldryoqwrevzxjkywpjnapgkdbm"],
      nickname: formData.nickName,
      country: "IN",
      phone: formData.mobile,
      email: formData.email,
      username: formData.account,
      password: formData.password,
    };
  
    try {
      // Use fetchDashboardInfo for POST request
      const response = await fetchDashboardInfo(
        '/account/add-users',
        'POST',
        apiData
      );
      console.log("API Response:", response);
      alert("Account created successfully!");
  
      // Reset form after submission
      setFormData({
        account: "",
        nickName: "",
        password: "",
        mobile: "",
        email: "",
        role: "",
        status: "",
        bindingProject: {
          proj1: false,
          proj2: false,
          proj3: false,
        },
      });
      onClose();
    } catch (error) {
      console.error("Error creating account:", error);
      alert("There was an error creating the account.");
    }
  };

  const handleCancel = () => {
    setFormData({
      account: "",
      nickName: "",
      password: "",
      mobile: "",
      email: "",
      role: "",
      status: "",
      bindingProject: {
        proj1: false,
        proj2: false,
        proj3: false,
      },
    });
    onClose();
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-[80vh] flex flex-col gap-4 items-center justify-center p-10 text-white"
    >
      {/* Text Field */}
      <div className="w-full flex items-center justify-center">
        <label className=" w-1/2 block text-sm font-medium mb-1">Account</label>
        <input
          type="text"
          name="account"
          value={formData.account}
          onChange={handleChange}
          className="mt-1 block w-full bg-white bg-opacity-5 border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200 text-black"
          required
        />
      </div>

      <div className="w-full flex items-center justify-center">
        <label className=" w-1/2 block text-sm font-medium mb-1">
          Nickname
        </label>
        <input
          type="text"
          name="nickName"
          value={formData.nickName}
          onChange={handleChange}
          className="mt-1 block w-full bg-white bg-opacity-5 border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200 text-black"
          required
        />
      </div>

      <div className="w-full flex items-center justify-center">
        <label className=" w-1/2 block text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full bg-white bg-opacity-5 border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200 text-black"
          required
        />
      </div>

      <div className="w-full flex items-center justify-center">
        <label className=" w-1/2 block text-sm font-medium mb-1">Mobile</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="mt-1 block w-full bg-white bg-opacity-5 border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200 text-black"
          required
        />
      </div>
      <div className="w-full flex items-center justify-center">
        <label className=" w-1/2 block text-sm font-medium mb-1">Email</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full bg-white bg-opacity-5 border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200 text-black"
          required
        />
      </div>

      {/* Radio Buttons */}
      <div className="w-full flex items-center justify-center">
        <span className=" w-1/2 block text-sm font-medium">Role</span>
        <div className="w-full flex items-start">
          <label className="mr-4">
            <input
              type="radio"
              name="role"
              value="guest"
              checked={formData.role === "guest"}
              onChange={handleChange}
              className="mr-1"
            />
            Guest
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={formData.role === "admin"}
              onChange={handleChange}
              className="mr-1"
            />
            Admin
          </label>
        </div>
      </div>

      <div className="w-full flex items-center justify-center">
        <span className=" w-1/2 block text-sm font-medium">Status</span>
        <div className="w-full flex items-start">
          <label className="mr-4">
            <input
              type="radio"
              name="status"
              value="enable"
              checked={formData.status === "enable"}
              onChange={handleChange}
              className="mr-1"
            />
            Enable
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="disable"
              checked={formData.status === "disable"}
              onChange={handleChange}
              className="mr-1"
            />
            Disable
          </label>
        </div>
      </div>

      {/* Checklist (Checkboxes) */}
      <div className="w-full flex items-start justify-center mt-2">
        <span className="w-1/2 block text-sm font-medium">Binding Project</span>
        <div className="w-full flex flex-col items-start">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="proj1"
              checked={formData.bindingProject.proj1}
              onChange={handleChange}
              className="mr-2"
            />
            Proj 1
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="proj2"
              checked={formData.bindingProject.proj2}
              onChange={handleChange}
              className="mr-2"
            />
            Proj 2
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="proj3"
              checked={formData.bindingProject.proj3}
              onChange={handleChange}
              className="mr-2"
            />
            Proj 3
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className={`flex space-x-4 mt-auto`}>
        <button
          onClick={handleCancel}
          className="min-w-32 px-4 py-2 bg-transparent border-2 border-white border-opacity-5 rounded hover:bg-white hover:bg-opacity-5"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="min-w-32 px-4 py-2 bg-green-600 text-zinc-900 font-medium rounded hover:bg-green-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default CreateAccountForm;
