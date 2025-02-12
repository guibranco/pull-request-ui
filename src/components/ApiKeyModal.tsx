import React, { useState, useEffect } from "react";

interface ApiKeyModalProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onApiKeySet }) => {
  const [inputKey, setInputKey] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedApiKey = localStorage.getItem("webhooksApiKey");
    if (!storedApiKey) {
      setShowModal(true);
    } else {
      onApiKeySet(storedApiKey);
    }
  }, [onApiKeySet]);

  const handleSaveApiKey = () => {
    if (inputKey.trim() !== "") {
      localStorage.setItem("webhooksApiKey", inputKey);
      onApiKeySet(inputKey);
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Enter Webhooks API Key</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter API Key..."
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSaveApiKey}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
