"use client";

import { useState } from "react";
import ImageTracer from "imagetracerjs";

const ImageToSVGConverter = () => {
  const [svg, setSvg] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Convert image to SVG using ImageTracer.js
  const convertImageToSVG = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          ImageTracer.imageToSVG(
            img.src,
            (svgString) => {
              resolve(svgString);
            },
            { pathomit: 8 }
          );
        };

        img.onerror = (error) => reject(error);
      };

      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file));

      try {
        const svgData = await convertImageToSVG(file);
        setSvg(svgData);
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }
  };

  return (
    <div>
      <h1>Convert Image to SVG</h1>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      <div>
        {svg ? (
          <div>
            <h2>Generated SVG:</h2>
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </div>
        ) : (
          <p>No SVG generated yet.</p>
        )}
      </div>
      {/* {imageFile && <img src={imageFile} alt="Uploaded Image" />} */}
    </div>
  );
};

export default ImageToSVGConverter;
