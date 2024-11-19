import React, { useState } from "react";

const HandoverModal = ({ isOpen, onClose, refreshAction }) => {
  const [formData, setFormData] = useState({
    field1: "",
    field2: "",
    textarea: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted!");

    refreshAction();
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
        <h2 className="text-lg font-semibold mb-4">Handover Project</h2>
        <form
          onSubmit={handleSubmit}
          className="w-[40vw] h-[40vh] flex flex-col gap-6 items-center justify-center"
        >
          <div className="w-full flex items-center justify-center">
            <label className="w-1/2">Account</label>
            <input
              type="text"
              name="field2"
              value={formData.field2}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 bg-white bg-opacity-5 border rounded focus:outline-none focus:ring focus:ring-blue-200 text-white"
              required
            />
          </div>

          <div className={`flex space-x-4 mt-4 justify-center`}>
            <button
              onClick={onClose}
              type="button"
              className="min-w-32 px-4 py-2 bg-transparent border-2 border-white border-opacity-5 rounded hover:bg-white hover:bg-opacity-5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-w-32 px-4 py-2 bg-green-600 text-zinc-900 font-medium rounded hover:bg-green-300"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HandoverModal;
