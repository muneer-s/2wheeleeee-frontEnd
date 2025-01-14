import Cropper from "react-easy-crop";
import { Button, Slider } from "@mui/material";
import {getCroppedImg} from "./cropImage"; // Helper function to crop the image
import {  useCallback, useState } from "react";
import './css.css'
const ImageCrop = ({ imageSrc, onCropComplete }: { imageSrc: string; onCropComplete: (croppedImage: Blob | null) => void }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteHandler = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    }
  };

  return (
    <div className="crop-container">
      <div className="cropper">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3} // Change this based on the desired aspect ratio
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteHandler}
        />
      </div>
      <div className="controls">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, zoom) => setZoom(zoom as number)}
        />
        <Button variant="contained" color="primary" onClick={handleCrop}>
          Crop Image
        </Button>
      </div>
    </div>
  );
};

export default ImageCrop;
