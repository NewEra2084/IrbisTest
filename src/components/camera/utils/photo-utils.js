/** Утилита для создания кропнутой круглой картинки */
export async function getCroppedImage(imageSrc, croppedAreaPixels) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  ctx.beginPath();
  ctx.arc(
    croppedAreaPixels.width / 2,
    croppedAreaPixels.height / 2,
    croppedAreaPixels.width / 2,
    0,
    Math.PI * 2,
    true
  );
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

export function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}