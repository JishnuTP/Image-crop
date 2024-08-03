// Example implementation of getCroppedImg function
export const getCroppedImg = (imageSrc, pixelCrop) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
  
    return new Promise((resolve, reject) => {
      image.src = imageSrc;
      image.onload = () => {
        const { width, height } = image;
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
  
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
  
        const base64Image = canvas.toDataURL('image/jpeg');
        resolve(base64Image);
      };
  
      image.onerror = reject;
    });
  };
  