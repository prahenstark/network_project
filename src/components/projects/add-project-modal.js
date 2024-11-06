import React, { useState } from "react";

const AddProjectModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    field1: "",
    field2: "",
    textarea: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Submitted!");
    closeModal();
    // onSubmit(formData);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-[#303531] p-8 rounded-lg relative shadow-lg">
        <button
          onClick={onClose}
          className=" absolute top-3 right-3  hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Add Project</h2>
        <form
          onSubmit={handleSubmit}
          className="w-[40vw] h-[40vh] flex flex-col gap-4 items-center justify-center"
        >
          <div className="w-full flex items-center justify-center">
            <label className="w-1/2">Superior Project</label>
            <h1 className="w-1/2">My_Project</h1>
          </div>
          <div className="w-full flex items-center justify-center">
            <label className="w-1/2">Field 2</label>
            <input
              type="text"
              name="field2"
              value={formData.field2}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 bg-white bg-opacity-5 border rounded focus:outline-none focus:ring focus:ring-blue-200 text-black"
              required
            />
          </div>
          <div className="w-full flex">
            <label className="w-1/2">Text Area</label>
            <textarea
              name="textarea"
              value={formData.textarea}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 bg-white bg-opacity-5 border rounded focus:outline-none focus:ring focus:ring-blue-200 text-black"
              rows="3"
              required
            />
          </div>
          {/* <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div> */}

          <div className={`flex space-x-4 mt-4 justify-center`}>
            <button
              onClick={onClose}
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
      </div>
    </div>
  );
};

export default AddProjectModal;
