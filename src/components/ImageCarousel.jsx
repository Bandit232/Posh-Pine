import React, { useState } from 'react';

export default function ImageCarousel({ images, productName }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return <div className="carousel-placeholder">No images available</div>;
  }

  return (
    <div className="image-carousel">
      <div className="carousel-container">
        <img 
          src={images[currentImageIndex]} 
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className="carousel-image"
        />
        
        {images.length > 1 && (
          <>
            <button 
              className="carousel-nav carousel-prev" 
              onClick={prevImage}
              aria-label="Previous image"
            >
              ◀
            </button>
            <button 
              className="carousel-nav carousel-next" 
              onClick={nextImage}
              aria-label="Next image"
            >
              ▶
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
