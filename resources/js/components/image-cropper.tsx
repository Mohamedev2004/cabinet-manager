import React, { useState, useRef, useCallback } from 'react';
import type { Crop, PixelCrop} from 'react-image-crop';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImageFile: File) => void;
  imageFile: File;
  aspectRatio?: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropper({ 
  isOpen, 
  onClose, 
  onCropComplete, 
  imageFile, 
  aspectRatio = 1 
}: ImageCropperProps) {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (imageFile && isOpen) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
      });
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile, isOpen]);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspectRatio) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspectRatio));
    }
  }, [aspectRatio]);

  const getCroppedImg = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    );

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const file = new File([blob], imageFile.name, {
          type: imageFile.type,
          lastModified: Date.now(),
        });
        resolve(file);
      }, imageFile.type);
    });
  }, [completedCrop, imageFile]);

  const handleCropComplete = async () => {
    try {
      const croppedImageFile = await getCroppedImg();
      if (croppedImageFile) {
        onCropComplete(croppedImageFile);
        onClose();
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleClose = () => {
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Adjust the crop area to select the portion of the image you want to use.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {imgSrc && (
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectRatio}
                minWidth={50}
                minHeight={50}
              >
                <img
                  ref={imgRef}
                  loading="lazy"
                  alt="Crop me"
                  src={imgSrc}
                  style={{ maxHeight: '400px', maxWidth: '100%' }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
          )}
          
          {/* Hidden canvas for cropping */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {/* <Button onClick={handleCropComplete} disabled={!completedCrop}>
              Apply Crop
            </Button> */}
            <Button
                onClick={handleCropComplete}
              >
               Apply Crop
              </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}