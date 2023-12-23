import React, { useState, ChangeEvent } from "react";
import { FaCamera } from "react-icons/fa";

interface ProfileImageProps {
  initialImage: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ initialImage }) => {
  const [selectedImage, setSelectedImage] = useState<string>(initialImage);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative mx-auto w-64 text-center">
      <div className="relative w-64">
        <img
          className="absolute h-64 w-64 rounded-full"
          src={selectedImage}
          alt=""
        />
        <label
          htmlFor="upload"
          className="group absolute flex h-64 w-64 cursor-pointer items-center justify-center rounded-full opacity-60 transition duration-500 hover:bg-gray-200"
        >
          <FaCamera className="hidden w-12 text-white group-hover:block" />
        </label>
        <input
          type="file"
          id="upload"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default ProfileImage;
