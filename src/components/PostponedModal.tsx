import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'postponedDismissed_v1';

const PostponedModal: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (!dismissed) setOpen(true);
    } catch (e) {
      setOpen(true);
    }
  }, []);

  const close = () => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={close} />
      <div className="relative bg-white rounded-lg max-w-xl w-full mx-4 p-6 shadow-2xl">
        <h3 className="text-xl font-semibold mb-3">Important Notice</h3>
        <p className="mb-4 text-gray-800">
          Due to unforeseen circumstances the conference has been postponed. We will post the new dates shortly.
        </p>
        <p className="mb-4 text-gray-800">
          For any queries email <a href="mailto:secretary@globalrenewablemeet.com" className="text-blue-600 underline">secretary@globalrenewablemeet.com</a>
        </p>
        <div className="flex justify-end">
          <button
            onClick={close}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostponedModal;
