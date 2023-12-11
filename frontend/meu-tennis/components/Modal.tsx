import React from 'react';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  modalText: string;
}

const CustomModal: React.FC<CustomModalProps> = ({ isVisible, onClose, modalText, children }) => {
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${isVisible ? 'block' : 'hidden'}`}>
      <div className="bg-black opacity-50 absolute inset-0"></div>
      <div className="bg-white p-8 rounded-md relative z-10">
        <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <p className="text-lg mb-4">{modalText}</p>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
