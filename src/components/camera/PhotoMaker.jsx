import React, { useState, useRef, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faCheck,
  faTimes,
  faTrash,
  faEdit,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { getCroppedImage } from "./utils/photo-utils.js";

const Spinner = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
  </div>
);

const PhotoMaker = ({imageLink, onSave, onRemove}) => {
  const [imageSrc, setImageSrc] = useState(imageLink);
  const [cropping, setCropping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  /** Инициализация камеры */
  useEffect(() => {
    if (!cameraActive) return;

    const initCamera = async () => {
      setIsCameraReady(false);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setIsCameraReady(true);
          };
        }
      } catch (err) {
        alert("Не удалось получить доступ к камере");
        setCameraActive(false);
      }
    };

    initCamera();

    return () => stopCamera();
  }, [cameraActive]);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraReady(false);
  };

  const cancelCamera = () => {
    stopCamera();
    setCameraActive(false);
  };

  const handleTakePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const blobUrl = canvas.toDataURL("image/png");

    setImageSrc(blobUrl);
    setCropping(true);
    cancelCamera();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Можно загружать только изображения");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
      setCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const createCroppedImage = async () => {
    setIsLoading(true);
    try {
      const cropped = await getCroppedImage(imageSrc, croppedAreaPixels);
      setImageSrc(cropped);
      setCropping(false);
      await handleUpload(cropped);
    } catch (err) {
      console.error(err);
      alert("Ошибка при обработке изображения");
    }
    setIsLoading(false);
  };

  const handleUpload = async (image) => {
    try {
      const blob = await fetch(image).then((res) => res.blob());
      const file = new File([blob], "profile.png", { type: "image/png" });

      const serverUrl = await onSave(file);

      setImageSrc(serverUrl);
    } catch {
      alert("Ошибка при загрузке аватара");
    }
  };

  const removeImage = async () => {
    setIsLoading(true);
    try {
      await onRemove();

      setImageSrc(null);
    } catch {
      alert("Ошибка при удалении аватара");
    }
    setIsLoading(false);
  };

  const disableControls = isLoading || (cameraActive && !isCameraReady);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-300 flex items-center justify-center relative">
        {(isLoading || (cameraActive && !isCameraReady)) && <Spinner />}

        {cameraActive ? (
          <video ref={videoRef} className="w-full h-full object-cover" />
        ) : cropping && imageSrc ? (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            className="absolute inset-0"
          />
        ) : imageSrc ? (
          <img src={imageSrc} alt="Профиль" className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400 text-sm">Нет фото</div>
        )}
      </div>

      {cropping ? (
        <div className="flex space-x-2">
          <button
            disabled={disableControls}
            onClick={createCroppedImage}
            className={`rounded-xl p-3 ${disableControls ? "opacity-50" : ""} bg-green-600 hover:bg-green-700 text-white`}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button
            disabled={disableControls}
            onClick={() => setCropping(false)}
            className={`rounded-xl p-3 ${disableControls ? "opacity-50" : ""} bg-gray-600 hover:bg-gray-700 text-white`}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      ) : (
        <div className="flex space-x-2">
          {imageSrc ? (
            <>
              <button
                disabled={disableControls}
                onClick={removeImage}
                className={`rounded-xl p-3 ${disableControls ? "opacity-50" : ""} bg-red-600 hover:bg-red-700 text-white`}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button
                disabled={disableControls}
                onClick={() => setCropping(true)}
                className={`rounded-xl p-3 ${disableControls ? "opacity-50" : ""} bg-yellow-600 hover:bg-yellow-700 text-white`}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </>
          ) : cameraActive ? (
            <>
              <button
                disabled={disableControls}
                onClick={handleTakePhoto}
                className={`rounded-xl p-3 ${disableControls ? "opacity-50" : ""} bg-green-600 hover:bg-green-700 text-white`}
              >
                <FontAwesomeIcon icon={faCamera} />
              </button>
              <button
                disabled={disableControls}
                onClick={cancelCamera}
                className={`rounded-xl p-3 ${disableControls ? "opacity-50" : ""} bg-gray-600 hover:bg-gray-700 text-white`}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                disabled={disableControls}
                onClick={() => setCameraActive(true)}
                className={`rounded-xl p-3 ${disableControls ? "opacity-50" : ""} bg-yellow-600 hover:bg-yellow-700 text-white`}
              >
                <FontAwesomeIcon icon={faCamera} />
              </button>
              <button
                disabled={disableControls}
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-xl p-3 ${disableControls ? "opacity-50" : ""} bg-blue-600 hover:bg-blue-700 text-white`}
              >
                <FontAwesomeIcon icon={faUpload} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoMaker;
