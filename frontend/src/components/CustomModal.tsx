import React, { useRef, useEffect } from 'react';
import Modal from 'react-modal';

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title: string;
  onConfirm: (input: string) => void;
  defaultValue?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onRequestClose,
  title,
  onConfirm,
  defaultValue = ''
}) => {
  const [inputValue, setInputValue] = React.useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    setInputValue(defaultValue);
  }, [isOpen, defaultValue]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onConfirm(inputValue);
      setInputValue('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add New Item"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#120322] p-6 rounded-lg shadow-lg w-96 border border-purple-800/30 backdrop-blur-sm"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <h2 className="text-lg font-semibold mb-4 text-purple-100">{title}</h2>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        ref={inputRef}
        className="w-full px-4 py-2 bg-[#2A1A4A] text-purple-100 border border-purple-800/30 rounded-lg mb-4 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-purple-400"
        placeholder="Enter name"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
      />
      <div className="flex justify-end gap-4">
        <button
          onClick={onRequestClose}
          className="px-4 py-2 bg-[#2A1A4A] text-purple-100 rounded-lg hover:bg-purple-800/20 transition-colors duration-300 border border-purple-800/30"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default CustomModal;