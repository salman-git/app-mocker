import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Box, Button, IconButton, Slider, Typography, ImageList, ImageListItem, TextField, Checkbox } from '@mui/material';
import Grid from '@mui/material/Grid2';
import RestoreIcon from '@mui/icons-material/Restore';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import HomeIcon from '@mui/icons-material/Home';
import CropPortraitIcon from '@mui/icons-material/CropPortrait';
import TitleIcon from '@mui/icons-material/Title';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { SketchPicker } from 'react-color';
import { styled } from '@mui/material/styles';
import FlipToFrontIcon from '@mui/icons-material/FlipToFront';
import FlipToBackIcon from '@mui/icons-material/FlipToBack';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import Divider from '@mui/material/Divider';
import { GroupOutlined, UngroupOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import { PanTool, PanToolOutlined } from '@mui/icons-material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'


const phoneFrames = [
  { id: 'phone1', src: './assets/phone1.svg', name: 'Phone 1' },
  { id: 'phone2', src: './assets/phone2.svg', name: 'Phone 2' },
  { id: 'phone3', src: './assets/phone3.svg', name: 'Phone 3' },
  { id: 'phone4', src: './assets/phone4.svg', name: 'Phone 4' },
  { id: 'phone5', src: './assets/phone5.svg', name: 'Phone 5' },
  { id: 'phone6', src: './assets/phone6.svg', name: 'Phone 6' },
  { id: 'phone7', src: './assets/phone7.svg', name: 'Phone 7' },

];
const fonts = [
  { name: 'Roboto', style: { fontFamily: 'Roboto' } },
  { name: 'Montaga', style: { fontFamily: 'Montaga' } },
  { name: 'Itim', style: { fontFamily: 'Itim' } },
  { name: 'Oswald', style: { fontFamily: 'Oswald' } },
  { name: 'Lato', style: { fontFamily: 'Lato' } },
  { name: 'Montserrat', style: { fontFamily: 'Montserrat' } },
  { name: 'Creepster', style: { fontFamily: 'Creepster' } },
];

export const CanvasComponent = () => {
  const theme = useTheme()
  const canvasEl = useRef(null);
  const canvasRef = useRef(null);
  const canvasHolderRef = useRef(null)

  const phoneWidth = 960
  const phoneHeight = 2024
  const phoneHolderWidth = phoneWidth * 1.4;
  const phoneHolderHeight = phoneHeight * 1.4;
  const [phones, setPhones] = useState([])
  const [phoneHolders, setPhoneHolders] = useState([])

  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [skew, setSkew] = useState({ x: 0, y: 0 });
  const [selectedIcon, setSelectedIcon] = useState('home');
  const [backgroundColor, setBackgroundColor] = useState('yellow');
  const [tempColor, setTempColor] = useState('yellow');
  const [cornerRadius, setCornerRadius] = useState(10)
  const [showPicker, setShowPicker] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [textFillColor, setTextFillColor] = useState('#000000')
  const [tempTextFillColor, setTempTextFillColor] = useState('#000000')
  const [showTextFillColorPicker, setShowTextFillColorPicker] = useState(false)
  const [textStrokeColor, setTextStrokeColor] = useState('#000000')
  const [tempTextStrokeColor, setTempTextStrokeColor] = useState('#000000')
  const [showTextStrokeColorPicker, setShowTextStrokeColorPicker] = useState(false)
  const [textStrokeWidth, setTextStrokeWidth] = useState(0)
  const [isPanning, setIsPanning] = useState(true)
  const [selectedFrame, setSelectedFrame] = useState(phoneFrames[6].src);
  const [selectedFont, setSelectedFont] = useState('Roboto');
  const [fontStyle, setFontStyle] = useState({
    bold: false,
    italic: false,
    underline: false,
    overline: false,
    lineThrough: false,
    textSize: 120
  });
  const [shadow, setShadow] = useState({
    color: "#000000",
    offsetX: 10,
    offsetY: 10,
    enable: true,
    blur: 50,
  });
  const [showShadowColorPicker, setShowShadowColorPicker] = useState(false)
  const [tempShadowColor, setTempShadowColor] = useState("#000000")

  const handleChange = (event) => {
    const font = event.target.value;
    setSelectedFont(font);
  };

  const handleColorChange = (color) => {
    setBackgroundColor(color.hex);
  };

  const deleteSelection = () => {
    const activeObject = canvasRef.current.getActiveObject();
    if (!activeObject) return
    if (activeObject.type == "textbox" && activeObject.isEditing == true) {
      return;
    }
    if (activeObject) {
      canvasRef.current.remove(activeObject);
      canvasRef.current.discardActiveObject();
      canvasRef.current.renderAll();
    }
  }
  const updateCanvasSize = () => {
    const canvasWidth = canvasHolderRef.current.getBoundingClientRect().width;
    const canvasHeight = window.innerHeight//canvasHolderRef.current.getBoundingClientRect().height;

    canvasRef.current.setWidth(canvasWidth);
    canvasRef.current.setHeight(canvasHeight);

    canvasRef.current.renderAll();
  }

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasEl.current);
    canvas.isPanning = true
    canvasRef.current = canvas;

    console.log('canvas', canvas);
    canvas.setZoom(0.15);

    canvas.on('mouse:down', function (opt) {
      var evt = opt.e;
      if (evt.altKey === true || canvas.isPanning) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }

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

    canvas.on('selection:updated', function (opt) {
      if (opt.selected.length == 1) {
        handleIconClick(opt.selected[0].name || "home")
      }
    })
    canvas.on('selection:created', function (opt) {
      if (opt.selected.length == 1) {
        handleIconClick(opt.selected[0].name || "home")
      }
    })

    const handleKeyDown = (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        deleteSelection()
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    let phoneHolder = addPhoneHolder(50, 500);
    setPhoneHolders([...phoneHolders, phoneHolder])
    addPhoneFrame(selectedFrame, phoneHolder);
    canvas.requestRenderAll();

    updateCanvasSize();
    applyCanvasBackground();

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      canvas.dispose();
      // window.removeEventListener('resize', updateCanvasSize);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {

  }, [canvasHolderRef.current])

  useEffect(() => { canvasRef.current.isPanning = isPanning }, [isPanning])
  useEffect(_ => {
    applyTransformations()
  }, [rotation, skew])
  useEffect(_ => {
    const activeObject = canvasRef.current.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('fontFamily', selectedFont);
      canvasRef.current.requestRenderAll();
    }
  }, [selectedFont])
  useEffect(_ => {
    const activeObject = canvasRef.current.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set({
        'fontWeight': fontStyle.bold ? 'bold' : 'normal',
        'fontStyle': fontStyle.italic ? 'italic' : 'normal',
        'underline': fontStyle.underline,
        'overline': fontStyle.overline,
        'linethrough': fontStyle.lineThrough,
        'fontSize': fontStyle.textSize
      });
      canvasRef.current.requestRenderAll();
    }
  }, [fontStyle])

  useEffect(() => {
    const activeObject = canvasRef.current.getActiveObject()
    if (!activeObject) return;
    if (activeObject.name == 'phone-holder') {
      activeObject.set({
        fill: backgroundColor
      })
    }
    canvasRef.current.requestRenderAll()
  }, [backgroundColor])

  useEffect(() => {
    const activeObject = canvasRef.current.getActiveObject()
    if (!activeObject) return;
    if (activeObject.name == 'text') {
      activeObject.set({
        fill: textFillColor,
        stroke: textStrokeColor,
        strokeWidth: textStrokeWidth
      })
    }
    canvasRef.current.requestRenderAll()
  }, [textFillColor, textStrokeColor, textStrokeWidth])

  useEffect(() => {
    const activeObject = canvasRef.current.getActiveObject()
    if (!activeObject) return;
    if (activeObject.name == 'phone-holder') {
      activeObject.set({
        rx: cornerRadius * 2,
        ry: cornerRadius * 2
      })
    }
    canvasRef.current.requestRenderAll()
  }, [cornerRadius])

  useEffect(() => {
    const activeObject = canvasRef.current.getActiveObject()
    if (!activeObject) return
    activeObject.set({
      shadow: shadow.enable ? shadow : {}
    })
    canvasRef.current.requestRenderAll()
  }, [shadow])

  const createGradientBackground = () => {
    const patternCanvas = document.createElement('canvas');
    const patternSize = 40;
    patternCanvas.width = patternSize;
    patternCanvas.height = patternSize;
    const ctx = patternCanvas.getContext('2d');

    ctx.fillStyle = theme.palette.canvasBackground;
    ctx.fillRect(0, 0, patternSize, patternSize);

    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < patternSize; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, patternSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, x);
      ctx.lineTo(patternSize, x);
      ctx.stroke();
    }

    return patternCanvas.toDataURL();
  };

  const applyCanvasBackground = () => {
    const backgroundDataUrl = createGradientBackground();
    canvasRef.current.setBackgroundColor(
      { source: backgroundDataUrl, repeat: 'repeat' },
      canvasRef.current.renderAll.bind(canvasRef.current)
    );
  };


  const addPhoneFrame = (phoneFrameUrl, phoneHolder) => {
    fabric.loadSVGFromURL(phoneFrameUrl, (objects, options) => {
      let phone = fabric.util.groupSVGElements(objects, options);
      phone.set({
        name: 'phone-frame',
        lockRotation: true,
        scaleX: phoneWidth / phone.width,
        scaleY: phoneHeight / phone.height,
        top: phoneHolder.top + phoneHolderHeight - (phoneHolderHeight * 0.05) - phoneHeight,
        left: phoneHolder.left + (phoneHolderWidth - phoneWidth) / 2,
        shadow: {
          color: 'rgba(0,0,0,0.3)',  // Shadow color and opacity
          blur: 10,                  // Shadow blur (softness)
          offsetX: 20,               // Horizontal offset
          size: 10,
          offsetY: 10,               // Vertical offset
        }
      });
      phone.bringToFront()
      canvasRef.current.add(phone);
      setPhones([...phones, phone])
    });
  };

  const addText = (phoneHolder) => {

    let text = new fabric.Textbox("double-click to edit", {
      fontFamily: selectedFont,
      fontSize: fontStyle.textSize,
      fontWeight: fontStyle.bold ? 'bold' : 'normal',
      fontStyle: fontStyle.italic ? 'italic' : 'normal',
      underline: fontStyle.underline,
      overline: fontStyle.overline,
      linethrough: fontStyle.linethgrough,
      top: phoneHolder.top * 1.1,
      left: phoneHolder.left + phoneHolder.width / 2,
      width: phoneHolder.width,
      height: phoneHolder.height,
      textAlign: "center",
      originX: "center",
      originY: "top",
      fill: textFillColor,
      editable: true,
    });

    text.name = 'text';
    text.bringToFront();
    canvasRef.current.add(text);
  };

  const addPhoneHolder = (holderTop, holderLeft) => {
    const phoneHolder = new fabric.Rect({
      top: holderTop,
      left: holderLeft,
      width: phoneHolderWidth,
      height: phoneHolderHeight,
      fill: backgroundColor,
      rx: cornerRadius * 2,
      ry: cornerRadius * 2,
    });
    phoneHolder.set({
      name: 'phone-holder'
    })
    phoneHolder.sendToBack()
    canvasRef.current.add(phoneHolder);
    return phoneHolder;
  };

  const ungroupObjects = () => {
    const canvas = canvasRef.current
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== 'group') {
      return;
    }
    canvas.getActiveObject().toActiveSelection();
    canvas.requestRenderAll();
    return canvas.getActiveObjects()
  };

  const groupObjects = () => {
    const canvas = canvasRef.current;
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== 'activeSelection') {
      return;
    }
    canvas.getActiveObject().toGroup();
    canvas.requestRenderAll();
  };

  const sendToBack = () => {
    const canvas = canvasRef.current;
    if (!canvas.getActiveObject()) {
      return;
    }
    canvas.getActiveObject().sendToBack();
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }

  const bringToFront = () => {
    const canvas = canvasRef.current;
    if (!canvas.getActiveObject()) {
      return;
    }
    canvas.getActiveObject().bringToFront();
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }

  const sendBackward = () => {
    const canvas = canvasRef.current;
    if (!canvas.getActiveObject()) {
      return;
    }
    canvas.getActiveObject().sendBackwards();
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }
  const bringForward = () => {
    const canvas = canvasRef.current;
    if (!canvas.getActiveObject()) {
      return;
    }
    canvas.getActiveObject().bringForward();
    canvas.discardActiveObject()
    canvas.requestRenderAll()
  }


  const handleImageUpload = (event) => {

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const imgElement = new Image();
      imgElement.src = e.target.result;
      let selectedPhone = canvasRef.current.getActiveObject();

      imgElement.onload = () => {
        const imgInstance = new fabric.Image(imgElement, {});

        if (!selectedPhone) {
          canvasRef.current.add(imgInstance);
          canvasRef.current.requestRenderAll()
          return
        } else if (selectedPhone && selectedPhone.name == 'phone-holder') {
          selectedPhone.set({
            fill: new fabric.Pattern({
              source: imgElement,
              repeat: 'no-repeat' // or 'repeat' for tiling
            }),

          })
          canvasRef.current.requestRenderAll()
          return
        }
        else if (selectedPhone.name != 'phone-frame' && selectedPhone.name != 'phone-group')
          return;

        if (selectedPhone.name == 'phone-group') {
          const ungrouped = ungroupObjects()
          selectedPhone = ungrouped.find(obj => obj.name == 'phone-frame')
          canvasRef.current.setActiveObject(selectedPhone)
          canvasRef.current.remove(ungrouped.find(obj => obj.name == 'img-instance'))
        }
        selectedPhone.set({
          angle: 0,
          skewX: 0,
          skewY: 0,
          originX: 'left',
          originY: 'top'
        })

        let innerScreen = selectedPhone.getObjects().find(obj => obj.id == 'inner-screen');
        let outerFrame = selectedPhone.getObjects().find(obj => obj.id == 'outer-frame');

        imgInstance.set({ name: 'img-instance', objectCaching: false })
        const innerScreenWidth = innerScreen.width;
        const innerScreenHeight = innerScreen.height

        const scaleX = innerScreenWidth / imgInstance.width;
        const scaleY = innerScreenHeight / imgInstance.height;
        const scaleFactor = Math.max(scaleX, scaleY);

        imgInstance.set({
          scaleX: scaleFactor,
          scaleY: scaleFactor
        });

        const newPhoneWidth = (imgInstance.width * scaleFactor);
        const newPhoneHeight = (imgInstance.height * scaleFactor);

        selectedPhone.set({
          scaleX: newPhoneWidth / innerScreen.width,
          scaleY: newPhoneHeight / innerScreen.height,
        });

        const clipPath = new fabric.Rect({
          width: imgInstance.width,
          height: imgInstance.height,
          rx: innerScreen.rx,
          ry: innerScreen.ry,
          originX: 'center',
          originY: 'center'
        });

        imgInstance.set({
          left: selectedPhone.left + (selectedPhone.width * selectedPhone.scaleX - imgInstance.width * scaleFactor) / 2,
          top: selectedPhone.top + (selectedPhone.height * selectedPhone.scaleY - imgInstance.height * scaleFactor) / 2,
          clipPath: clipPath
        });

        var sel = new fabric.ActiveSelection([imgInstance, selectedPhone], {
          canvas: canvasRef.current,
        });

        let phoneGroup = sel.toGroup()
        phoneGroup.set({ name: 'phone-group', lockRotation: true })
        canvasRef.current.setActiveObject(phoneGroup);
        applyTransformations()
        canvasRef.current.renderAll();
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };


  const handleExport = () => {
    const phoneHolders = canvasRef.current.getObjects().filter(obj => obj.name === 'phone-holder');

    phoneHolders.forEach(phoneHolder => {
      const phoneHolderWidth = phoneHolder.width * phoneHolder.scaleX
      const phoneHolderHeight = phoneHolder.height * phoneHolder.scaleY
      const tempCanvas = new fabric.StaticCanvas(null);
      tempCanvas.setDimensions({
        width: phoneHolderWidth,
        height: phoneHolderHeight,
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

      Promise.all(cloningPromises).then(() => {
        const dataURL = tempCanvas.toDataURL({
          format: 'png',
          quality: 1,
        });

        const img = new Image();
        img.onload = () => {
          const cropCanvas = document.createElement('canvas');
          cropCanvas.width = phoneHolderWidth;
          cropCanvas.height = phoneHolderHeight;
          const ctx = cropCanvas.getContext('2d');

          ctx.drawImage(img, 0, 0, phoneHolderWidth, phoneHolderHeight);

          const croppedDataURL = cropCanvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = croppedDataURL;
          link.download = 'phoneholders-export.png';
          link.click();

          tempCanvas.dispose();
        };
        img.src = dataURL;
      });
    });
  };

  const handleRotationChange = (axis) => (event, newValue) => {
    setRotation((prevRotation) => ({ ...prevRotation, [axis]: newValue }));
  };

  const handleSkewChange = (axis) => (event, newValue) => {
    setSkew((prevSkew) => ({ ...prevSkew, [axis]: newValue }));
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
  const handleIconClick = (iconName) => {
    setSelectedIcon(iconName);
  };

  const StyledIconButton = styled(Box)(({ theme }) => ({
    color: 'white',
    backgroundColor: 'grey',
    width: '100%',
    marginBottom: 5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
    display: 'flex',
    paddingTop: 10,
    paddingBottom: 10

  }));

  const toggleBold = () => setFontStyle((prev) => ({ ...prev, bold: !prev.bold }));
  const toggleItalic = () => setFontStyle((prev) => ({ ...prev, italic: !prev.italic }));
  const toggleUnderline = () => setFontStyle((prev) => ({ ...prev, underline: !prev.underline }));
  const toggleOverline = () => setFontStyle((prev) => ({ ...prev, overline: !prev.overline }));
  const toggleLineThrough = () => setFontStyle((prev) => ({ ...prev, lineThrough: !prev.lineThrough }));


  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid size={1} sx={{
        width: 50,
        backgroundColor: 'grey',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'visible',

      }}>
        <img src="./logo192.png"></img>

        <StyledIconButton
          title="home"
          onClick={() => handleIconClick('home')}
          sx={{
            background: selectedIcon == "home" ? 'darkgrey' : ''
          }}
        >
          <HomeIcon />
        </StyledIconButton>
        <StyledIconButton
          title="phone holder"
          onClick={() => handleIconClick('phone-holder')}
          sx={{
            background: selectedIcon == "phone-holder" ? 'darkgrey' : ''
          }}
        >
          <CropPortraitIcon />
        </StyledIconButton>
        <StyledIconButton
          title="phone"
          onClick={() => handleIconClick('phone-frame')}
          sx={{
            background: selectedIcon == "phone-frame" ? 'darkgrey' : ''
          }}
        >
          <PhoneAndroidIcon />
        </StyledIconButton>
        <StyledIconButton
          title="text"
          onClick={() => handleIconClick('text')}
          sx={{
            background: selectedIcon == "text" ? 'darkgrey' : ''
          }}
        >
          <TitleIcon />
        </StyledIconButton>
        <StyledIconButton
          title="upload screenshots"
          onClick={() => handleIconClick('upload-screenshot')}
          sx={{
            background: selectedIcon == "upload-screenshot" ? 'darkgrey' : ''
          }}
        >
          <FileUploadIcon />
        </StyledIconButton>
      </Grid>
      <Grid size={2} sx={{
        backgroundColor: 'lightgrey',
        padding: 2,
        overflow: 'visible',
        display: 'flex',
        justifyContent: 'center'
      }}>
        {selectedIcon == 'home' && <Box sx={{ backgroundColor: 'lightgrey', width: '100%', padding: 2, borderRadius: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>Rotate</Typography>
            <IconButton sx={{ px: 1 }} size='small' onClick={_ => {
              setRotation({ x: 0, y: 0, z: 0 });
            }}>
              <RestoreIcon fontSize='small' />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ flexGrow: 1, fontsize: 10 }}>rotate Z</Typography>
            <Typography variant='body2' sx={{ px: 2, borderRadius: 5, background: 'grey', fontSize: 10, textAlign: 'center', alignSelf: 'center' }}>{rotation.z}</Typography>
          </Box>
          <Slider
            value={rotation.z}
            onChange={handleRotationChange('z')}
            min={0}
            max={360}
            aria-labelledby="rotate-z-slider"
          />
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>Skew</Typography>
            <IconButton sx={{ px: 1 }} size='small' onClick={_ => {
              setSkew({ x: 0, y: 0 });
            }}>
              <RestoreIcon fontSize='small' />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ flexGrow: 1, fontsize: 10 }}>skew X</Typography>
            <Typography variant='body2' sx={{ px: 2, borderRadius: 5, background: 'grey', fontSize: 10, textAlign: 'center', alignSelf: 'center' }}>{skew.x}</Typography>
          </Box>
          <Slider
            value={skew.x}
            onChange={handleSkewChange('x')}
            min={-50}
            max={50}
            aria-labelledby="skew-x-slider"
          />
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ flexGrow: 1, fontsize: 10 }}>skew Y</Typography>
            <Typography variant='body2' sx={{ px: 2, borderRadius: 5, background: 'grey', fontSize: 10, textAlign: 'center', alignSelf: 'center' }}>{skew.y}</Typography>
          </Box>          <Slider
            value={skew.y}
            onChange={handleSkewChange('y')}
            min={-50}
            max={50}
            aria-labelledby="skew-y-slider"
          />

          {/* shadowsection */}
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>Shadow</Typography>
            <IconButton sx={{ px: 1 }} size='small' onClick={_ => {
              setShadow({ color: "#000000", offsetX: 10, offsetY: 10, blur: 50, opacity: 100 });
            }}>
              <RestoreIcon fontSize='small' />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ flexGrow: 1, fontsize: 10 }}>enable</Typography>
            <Checkbox value={shadow.enable} onChange={event => setShadow(prev => ({ ...prev, enable: event.target.checked }))} />
          </Box>
          {shadow.enable && <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>color</Typography>
              <Box
                sx={{
                  width: 30,
                  height: 20,
                  backgroundColor: shadow.color,
                  cursor: 'pointer',
                  border: '1px solid #ccc'
                }}
                onClick={() => setShowShadowColorPicker(!showShadowColorPicker)}
              />
              {showShadowColorPicker && (
                <Box sx={{ backgroundColor: 'white', position: 'absolute', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <SketchPicker
                    color={tempShadowColor}
                    onChange={color => setTempShadowColor(color.hex)}
                  />
                  <Button variant='text' onClick={_ => {
                    setShadow(prev => ({ ...prev, color: tempShadowColor }))
                    setShowShadowColorPicker(false)
                  }}>Done</Button>
                </Box>
              )}
            </Box>
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography variant="body2" sx={{ flexGrow: 1, fontsize: 10 }}>x-offset</Typography>
                <Typography variant='body2' sx={{ px: 2, borderRadius: 5, background: 'grey', fontSize: 10, textAlign: 'center', alignSelf: 'center' }}>{shadow.offsetX}</Typography>
              </Box>
              <Slider
                value={shadow.offsetX}
                onChange={(e, value) => setShadow(prev => ({ ...prev, offsetX: value }))}
                min={-100}
                max={100}
              />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography variant="body2" sx={{ flexGrow: 1, fontsize: 10 }}>y-offset</Typography>
                <Typography variant='body2' sx={{ px: 2, borderRadius: 5, background: 'grey', fontSize: 10, textAlign: 'center', alignSelf: 'center' }}>{shadow.offsetY}</Typography>
              </Box>
              <Slider
                value={shadow.offsetY}
                onChange={(e, value) => setShadow(prev => ({ ...prev, offsetY: value }))}
                min={-100}
                max={100}
              />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography variant="body2" sx={{ flexGrow: 1, fontsize: 10 }}>blur</Typography>
                <Typography variant='body2' sx={{ px: 2, borderRadius: 5, background: 'grey', fontSize: 10, textAlign: 'center', alignSelf: 'center' }}>{shadow.blur}</Typography>
              </Box>
              <Slider
                value={shadow.blur}
                onChange={(e, value) => setShadow(prev => ({ ...prev, blur: value }))}
                min={0}
                max={100}
              />
            </Box>
          </Box>}

          <Button variant="contained" color="primary" onClick={handleExport} sx={{ mb: 2 }}>
            Export to PNG
          </Button>
        </Box>}
        {selectedIcon === 'phone-holder' && (
          <Box sx={{ backgroundColor: 'lightgrey', width: '100%', padding: 2, borderRadius: 5 }}>
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => {
              setPhoneHolders([...phoneHolders, addPhoneHolder(0, 0)]);
            }}>
              Add Holder
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Background</Typography>
              <Box
                sx={{
                  width: 30,
                  height: 20,
                  backgroundColor: backgroundColor,
                  cursor: 'pointer',
                  border: '1px solid #ccc'
                }}
                onClick={() => setShowPicker(!showPicker)}
              />
              {showPicker && (
                <Box sx={{ backgroundColor: 'white', position: 'absolute', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <SketchPicker
                    color={tempColor}
                    onChange={setTempColor}
                  />
                  <Button variant='text' onClick={_ => {
                    handleColorChange(tempColor)
                    setShowPicker(false)
                  }}>Done</Button>

                </Box>
              )}
            </Box>
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography variant="body2" sx={{ flexGrow: 1, fontsize: 10 }}>Corner radius</Typography>
                <Typography variant='body2' sx={{ px: 2, borderRadius: 5, background: 'grey', fontSize: 10, textAlign: 'center', alignSelf: 'center' }}>{cornerRadius}</Typography>
              </Box>
              <Slider
                value={cornerRadius}
                onChange={(e, value) => setCornerRadius(value)}
                min={0}
                max={100}
                aria-labelledby="rotate-z-slider"
              />
            </Box>
          </Box>
        )}
        {selectedIcon == 'text' && <Box sx={{ backgroundColor: 'lightgrey', width: '100%', padding: 2, borderRadius: 5 }}>
          <Button variant='contained' sx={{ mb: 2 }} onClick={_ => addText(phoneHolders[phoneHolders.length - 1])}>Add Text</Button>
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontsize: 10 }}>Text Size</Typography>
              <TextField type='number' height={10} value={fontStyle.textSize} onChange={e => setFontStyle(prev => ({ ...prev, textSize: e.target.value }))}
                sx={{
                  width: 70,
                  '& .MuiOutlinedInput-root': {
                    height: 30, // Adjust this value for your desired height
                    fontSize: 12,
                    padding: '0 8px', // Reduces padding for a shorter appearance
                    '& fieldset': {
                      borderColor: 'lightgrey', // Optional: adjust border color if needed
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '4px 0', // Reduces internal padding to decrease height further
                    textAlign: 'center',
                  },
                }}></TextField>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Text Color</Typography>
            <Box
              sx={{
                width: 30,
                height: 20,
                backgroundColor: textFillColor,
                cursor: 'pointer',
                border: '1px solid #ccc'
              }}
              onClick={() => setShowTextFillColorPicker(!showTextFillColorPicker)}
            />
            {showTextFillColorPicker && (
              <Box sx={{ backgroundColor: 'white', position: 'absolute', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <SketchPicker
                  color={tempTextFillColor}
                  onChange={color => setTempTextFillColor(color.hex)}
                />
                <Button variant='text' onClick={_ => {
                  setTextFillColor(tempTextFillColor)
                  setShowTextFillColorPicker(false)
                }}>Done</Button>
              </Box>
            )}

          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Stroke Color</Typography>
            <Box
              sx={{
                width: 30,
                height: 20,
                backgroundColor: textStrokeColor,
                cursor: 'pointer',
                border: '1px solid #ccc'
              }}
              onClick={() => setShowTextStrokeColorPicker(!showTextStrokeColorPicker)}
            />
            {showTextStrokeColorPicker && (
              <Box sx={{ backgroundColor: 'white', position: 'absolute', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <SketchPicker
                  color={tempTextStrokeColor}
                  onChange={color => setTempTextStrokeColor(color.hex)}
                />
                <Button variant='text' onClick={_ => {
                  setTextStrokeColor(tempTextStrokeColor)
                  setShowTextStrokeColorPicker(false)
                }}>Done</Button>

              </Box>
            )}

          </Box>
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontsize: 10 }}>Stroke Size</Typography>
              <Typography variant='body2' sx={{ px: 2, borderRadius: 5, background: 'grey', fontSize: 10, textAlign: 'center', alignSelf: 'center' }}>{textStrokeWidth}</Typography>
            </Box>
            <Slider
              value={textStrokeWidth}
              onChange={(e, value) => setTextStrokeWidth(value)}
              min={0}
              max={100}
              aria-labelledby="rotate-z-slider"
            />
          </Box>
          <FormControl fullWidth>
            <Typography variant='body1'>Font</Typography>
            <Select
              value={selectedFont}
              onChange={handleChange}
            >
              {fonts.map((font) => (
                <MenuItem key={font.name} value={font.name} style={font.style}>
                  {font.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{
            mt: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly',
            '& > *': {
              '&:hover': { border: '1px solid darkgrey' },
              padding: 1,
              cursor: 'pointer'
            }
          }}>
            <Typography sx={{ backgroundColor: fontStyle.bold ? 'grey' : '' }} onClick={toggleBold}><strong>Bold</strong></Typography>
            <Typography sx={{ fontStyle: 'italic', backgroundColor: fontStyle.italic ? 'grey' : '' }} onClick={toggleItalic}>Italic</Typography>
            <Typography sx={{ textDecoration: 'underline', backgroundColor: fontStyle.underline ? 'grey' : '' }} onClick={toggleUnderline}>U</Typography>
            <Typography sx={{ textDecoration: 'overline', backgroundColor: fontStyle.overline ? 'grey' : '' }} onClick={toggleOverline}>U</Typography>
            <Typography sx={{ textDecoration: 'line-through', backgroundColor: fontStyle.lineThrough ? 'grey' : '' }} onClick={toggleLineThrough}>U</Typography>
          </Box>
        </Box>}
        {selectedIcon == 'phone-frame' && <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: 'lightgrey', width: '100%', padding: 2, borderRadius: 5 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>Select Phone Frame</Typography>
          <ImageList cols={2} rowHeight={100} sx={{ height: 10, mb: 2, overflowX: 'auto', flexGrow: 1 }}>
            {phoneFrames.map((frame) => (
              <ImageListItem key={frame.id} onClick={() => setSelectedFrame(frame.src)}>
                <Box
                  component="img"
                  src={frame.src}
                  alt={frame.name}
                  sx={{
                    width: '100%', height: '100%', cursor: 'pointer',
                    border: selectedFrame === frame.src ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
                    borderRadius: 1,
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>

          <Button variant="contained" color="primary" onClick={() => {
            addPhoneFrame(selectedFrame, phoneHolders[phoneHolders.length - 1]);
          }}>
            Add Phone
          </Button>
        </Box>}
        {selectedIcon == 'upload-screenshot' && <Button sx={{
          padding: 2,
          border: '1px solid darkgrey',
          width: '100%',
          borderRadius: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDragging ? 'grey' : 'darkgrey',
        }}
          component="label"
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length) {
              handleImageUpload({ target: { files: e.dataTransfer.files } });
            }
          }}
        >
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          <CloudUploadIcon sx={{ color: 'white' }} />
          <Typography sx={{ color: 'white', mb: 2 }}><strong>Click to upload</strong> or drag and drop</Typography>
          <Typography sx={{ color: 'white' }}>PNG, JPG, JPEG, Webp</Typography>
        </Button>}
      </Grid>
      <Grid size={8} sx={{ flexGrow: 1 }}>
        <Grid container sx={{}} direction={'column'}>
          <Grid size={12} sx={{
            display: 'flex',
            backgroundColor: 'lightgrey',
            height: 50,
            alignContent: 'center',
            alignItems: 'center'
          }}>
            <IconButton variant="contained" onClick={_ => setIsPanning(!isPanning)} sx={{}} title={isPanning ? "deactivate panning" : "activate panning"}>
              {isPanning ? <PanTool /> : <PanToolOutlined />}
            </IconButton>
            <Divider orientation="vertical" flexItem />

            <IconButton variant="contained" onClick={groupObjects} sx={{}} title="group">
              <GroupOutlined />
            </IconButton>

            <IconButton variant="contained" onClick={ungroupObjects} sx={{}} title="ungroup">
              <UngroupOutlined />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton variant="contained" onClick={sendBackward} sx={{}} title="send backwards">
              <FlipToBackIcon />
            </IconButton>
            <IconButton variant="contained" onClick={bringForward} sx={{}} title="bring forward">
              <FlipToFrontIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton variant="contained" onClick={sendToBack} sx={{}} title="send to back">
              <VerticalAlignBottomIcon />
            </IconButton>
            <IconButton variant="contained" onClick={bringToFront} sx={{}} title="bring to front">
              <VerticalAlignTopIcon />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton variant="contained" onClick={deleteSelection} sx={{}} title="delete selected">
              <DeleteOutlinedIcon />
            </IconButton>
          </Grid>
          <Grid size={12} sx={{}} ref={canvasHolderRef}>
            <canvas ref={canvasEl} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};


export default CanvasComponent;
