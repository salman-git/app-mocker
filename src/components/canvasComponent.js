import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Box, Button, List, ListItem, ListItemText, Slider, Typography } from '@mui/material';

export const CanvasComponent = () => {
  const canvasEl = useRef(null);
  const canvasRef = useRef(null);
  const phoneHolderWidth = 1080;
  const phoneHolderHeight = 1920 * 1.2;
  const [phones, setPhones] = useState([])
  const [phoneHolders, setPhoneHolders] = useState([])

  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [skew, setSkew] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current);
    console.log('canvas', canvas)
    canvas.setZoom(0.15)

    canvas.on('mouse:down', function (opt) {
      var evt = opt.e;
      this.isDragging = true;
      this.selection = false;
      this.lastPosX = evt.clientX;
      this.lastPosY = evt.clientY;

    });
    canvas.on('mouse:move', function (opt) {
      if (this.isDragging && canvas.getActiveObjects().length < 1) {
        var e = opt.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
    canvas.on('mouse:up', function (opt) {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
    });
    canvas.on('mouse:wheel', function (opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
    canvasRef.current = canvas;

    let phoneHolder = addPhoneHolder();
    setPhoneHolders([...phoneHolders, phoneHolder])
    addPhoneFrame('./assets/phone.svg', phoneHolder);
    canvas.renderAll();

    // Update canvas size when the component mounts and when the window resizes
    const updateCanvasSize = () => {
      const canvasWidth = 3080; // Account for menu width
      const canvasHeight = window.innerHeight;

      // Scale canvas to fit phone holder size while keeping the aspect ratio
      const scale = Math.min(
        canvasWidth / phoneHolderWidth,
        canvasHeight / phoneHolderHeight
      );

      canvas.setWidth(canvasWidth);
      canvas.setHeight(canvasHeight);
      // canvas.setZoom(scale);



      canvas.renderAll();

    };

    updateCanvasSize(); // Initial sizing
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      canvas.dispose();
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  const addPhoneFrame = (phoneFrameUrl, phoneHolder) => {
    const phoneWidth = phoneHolderWidth * 0.8;
    const phoneHeight = phoneHolderHeight * 0.8;

    fabric.loadSVGFromURL(phoneFrameUrl, (objects, options) => {
      let phone = fabric.util.groupSVGElements(objects, options);
      phone.set({
        name: 'phone-frame',
        scaleX: phoneWidth / phone.width,
        scaleY: phoneHeight / phone.height,
        top: phoneHolder.top + phoneHolderHeight - (phoneHolderHeight * 0.05) - phoneHeight,
        left: phoneHolder.left + (phoneHolderWidth - phoneWidth) / 2,
      });
      canvasRef.current.add(phone);
      setPhones([...phones, phone])
    });
  };

  const addPhoneHolder = () => {
    const phoneHolder = new fabric.Rect({
      top: 50,
      left: 500,
      width: phoneHolderWidth,
      height: phoneHolderHeight,
      fill: 'yellow',
      rx: 10,
      ry: 10,
    });
    phoneHolder.set({
      name: 'phone-holder'
    })
    canvasRef.current.add(phoneHolder);
    return phoneHolder;
  };

  const ungroupObjects = (group) => {
    const ungrouped = [];
    if (group && group.type === 'group') {
      const objects = group.getObjects();
      const groupLeft = group.left;
      const groupTop = group.top;
      console.log(group.originX)
      objects.forEach((obj) => {
        obj.set({
          left: groupLeft,
          top: groupTop,
          group: null,
        });

        // Add the object back to the canvas
        canvasRef.current.add(obj);
        ungrouped.push(obj);
      });

      // Remove the group from the canvas
      canvasRef.current.remove(group);
      canvasRef.current.renderAll(); // Rerender the canvas
    }
    return ungrouped;
  };


  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.src = e.target.result;

      imgElement.onload = () => {
        let selectedPhone = canvasRef.current.getActiveObject();
        if (selectedPhone.name == 'phone-group') {
          const ungrouped = ungroupObjects(selectedPhone)
          selectedPhone = ungrouped.find(obj => obj.name == 'phone-frame')
          canvasRef.current.setActiveObject(selectedPhone)
          canvasRef.current.remove(ungrouped.find(obj => obj.name == 'img-instance'))
        }
        let innerScreen = selectedPhone.getObjects().find(obj => obj.id == 'inner-screen');
        let outerFrame = selectedPhone.getObjects().find(obj => obj.id == 'outer-frame');

        const imgInstance = new fabric.Image(imgElement, {});
        imgInstance.set({ name: 'img-instance' })
        const innerScreenWidth = innerScreen.width; // Use the scaled width of the inner screen
        const innerScreenHeight = innerScreen.height // Use the scaled height of the inner screen

        const scaleX = innerScreenWidth / imgInstance.width;
        const scaleY = innerScreenHeight / imgInstance.height;
        const scaleFactor = Math.max(scaleX, scaleY); // Use the larger factor to fill the inner screen

        imgInstance.set({
          scaleX: scaleFactor,
          scaleY: scaleFactor
        });

        const newPhoneWidth = (outerFrame.strokeWidth * 2) + (imgInstance.width * scaleFactor);
        const newPhoneHeight = (outerFrame.strokeWidth * 2) + (imgInstance.height * scaleFactor);

        selectedPhone.set({
          scaleX: newPhoneWidth / selectedPhone.width,
          scaleY: newPhoneHeight / selectedPhone.height,
        });

        const clipPath = new fabric.Rect({
          width: imgInstance.width,
          height: imgInstance.height,
          rx: outerFrame.rx + 10, // corner radius of outer-frame
          ry: outerFrame.ry + 10,
          originX: 'center',
          originY: 'center'
        });

        imgInstance.set({
          left: selectedPhone.left + (selectedPhone.width * selectedPhone.scaleX - imgInstance.width * scaleFactor) / 2,
          top: selectedPhone.top + (selectedPhone.height * selectedPhone.scaleY - imgInstance.height * scaleFactor) / 2,
          clipPath: clipPath
        });

        const phoneGroup = new fabric.Group([imgInstance, selectedPhone], {
          left: selectedPhone.left,
          top: selectedPhone.top,
          originX: 'left',
          originY: 'top',
          name: 'phone-group'
        });

        // Add the grouped phone and image to the canvas
        canvasRef.current.add(phoneGroup);
        canvasRef.current.remove(selectedPhone)
        canvasRef.current.setActiveObject(phoneGroup);
        canvasRef.current.renderAll();
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };


  const handleExport = () => {
    // Find all phone holders on the canvas
    const phoneHolders = canvasRef.current.getObjects().filter(obj => obj.name === 'phone-holder');

    // For each phone holder, export its contents
    phoneHolders.forEach(phoneHolder => {
      // Create a temporary canvas with the same dimensions as the phone holder
      const tempCanvas = new fabric.StaticCanvas(null);
      tempCanvas.setDimensions({
        width: phoneHolder.width,
        height: phoneHolder.height,
      });

      // Get all objects within or overlapping with the phone holder
      // const containedObjects = canvasRef.current.getObjects().filter(obj => {
      //   return (
      //     obj !== phoneHolder &&
      //     obj.left + obj.width * obj.scaleX > phoneHolder.left &&
      //     obj.top + obj.height * obj.scaleY > phoneHolder.top &&
      //     obj.left < phoneHolder.left + phoneHolder.width * phoneHolder.scaleX &&
      //     obj.top < phoneHolder.top + phoneHolder.height * phoneHolder.scaleY
      //   );
      // });

      // Clone each object and add it to the temporary canvas with offset adjustments
      const cloningPromises = [phoneHolder, ...canvasRef.current.getObjects()].map(obj => {
        return new Promise(resolve => {
          obj.clone(clonedObj => {
            clonedObj.set({
              left: clonedObj.left - phoneHolder.left,
              top: clonedObj.top - phoneHolder.top,
            });
            tempCanvas.add(clonedObj);
            resolve();
          });
        });
      });

      // Wait for all clones to finish, then export
      Promise.all(cloningPromises).then(() => {
        // Export temp canvas as data URL and crop to phone holder's exact dimensions
        const dataURL = tempCanvas.toDataURL({
          format: 'png',
          quality: 1,
        });

        // Create an image element to crop it further if needed
        const img = new Image();
        img.onload = () => {
          const cropCanvas = document.createElement('canvas');
          cropCanvas.width = phoneHolder.width;
          cropCanvas.height = phoneHolder.height;
          const ctx = cropCanvas.getContext('2d');

          // Draw the loaded image with cropping on the canvas
          ctx.drawImage(img, 0, 0, phoneHolder.width, phoneHolder.height);

          // Download the cropped image
          const croppedDataURL = cropCanvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = croppedDataURL;
          link.download = 'phoneholders-export.png';
          link.click();

          // Dispose of temporary canvases
          tempCanvas.dispose();
        };
        img.src = dataURL;
      });
    });
  };

  const handleRotationChange = (axis) => (event, newValue) => {
    setRotation((prevRotation) => ({ ...prevRotation, [axis]: newValue }));
    applyTransformations();
  };

  const handleSkewChange = (axis) => (event, newValue) => {
    setSkew((prevSkew) => ({ ...prevSkew, [axis]: newValue }));
    applyTransformations();
  };

  const applyTransformations = () => {
    const selectedObject = canvasRef.current.getActiveObject();
    if (selectedObject) {
      selectedObject.set({
        angle: rotation.z,
        skewX: skew.x,
        skewY: skew.y,
        originX: 'center',
        originY: 'center'
      });
      canvasRef.current.renderAll();

    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left Menu Panel as a Box */}
      <Box
        sx={{
          width: 400,
          backgroundColor: 'lightgray',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          padding: 2,
          overflow: 'visible'
        }}
      >
        {/* Rotate Section */}
        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle2">Rotate X</Typography>
          <Slider
            value={rotation.x}
            onChange={handleRotationChange('x')}
            min={0}
            max={360}
            aria-labelledby="rotate-x-slider"
          />
          <Typography variant="body2">Rotate Y</Typography>
          <Slider
            value={rotation.y}
            onChange={handleRotationChange('y')}
            min={0}
            max={360}
            aria-labelledby="rotate-y-slider"
          />
          <Typography variant="body2">Rotate Z</Typography>
          <Slider
            value={rotation.z}
            onChange={handleRotationChange('z')}
            min={0}
            max={360}
            aria-labelledby="rotate-z-slider"
          />
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography variant="body2">Skew X</Typography>
          <Slider
            value={skew.x}
            onChange={handleSkewChange('x')}
            min={-50}
            max={50}
            aria-labelledby="skew-x-slider"
          />
          <Typography variant="body2">Skew Y</Typography>
          <Slider
            value={skew.y}
            onChange={handleSkewChange('y')}
            min={-50}
            max={50}
            aria-labelledby="skew-y-slider"
          />
        </Box>
        <Box >
          <Button variant="contained" component="label" sx={{ mb: 2 }} >
            Upload Screenshot
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
          <Button variant="contained" color="primary" onClick={handleExport} sx={{ mb: 2 }}>
            Export to PNG
          </Button>
          <Button variant="contained" color="primary" onClick={_ => console.log("ungrouped", ungroupObjects(canvasRef.current.getActiveObject()))} sx={{ mb: 2 }}>
            Ungroup
          </Button>
        </Box>
      </Box>



      <Box style={{ backgroundColor: 'grey' }}>
        <canvas ref={canvasEl} />
      </Box>
    </Box>
  );
};

export default CanvasComponent;
