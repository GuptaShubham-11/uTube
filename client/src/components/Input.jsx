import React, { useState } from 'react';

export default function Input({
  type = 'text',
  name,
  placeholder,
  icon,
  onChange,
  accept = '', // Accept attribute for file input (images, videos)
  value = '', // Controlled input value
  className = '', // Allow additional class names
}) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show file preview for image/video
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
    } else {
      setPreview(null);
    }
    if (onChange) onChange(e); // Trigger parent onChange (for file)
  };

  return (
    <div className="relative mb-5">
      {icon && (
        <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-300">{icon}</span>
      )}

      {type === 'file' ? (
        <>
          <input
            type="file"
            name={name}
            accept={accept}
            onChange={handleFileChange}
            className={`w-full pl-10 pr-4 py-3 outline-none border rounded-lg focus:ring-2 focus:ring-primary text-black dark:text-white ${className}`}
          />
          {preview && (
            <div className="mt-2">
              {accept.includes('image') ? (
                <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-lg" />
              ) : accept.includes('video') ? (
                <video src={preview} controls className="w-full h-32 rounded-lg" />
              ) : (
                <p className="text-gray-500 dark:text-gray-300">Preview not available</p>
              )}
            </div>
          )}
        </>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-3 outline-none border rounded-lg focus:ring-2 focus:ring-primary text-gray-800 dark:text-white ${className}`}
        />
      )}
    </div>
  );
}
