import { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './Gallery.css'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';



const Gallery = () => {

    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch('images.json')
            .then(res => res.json())
            .then(data => setImages(data))
    }, [])

    const handleDragDrop = (result) => {
        const { source, destination, type } = result;
        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        if (type === 'group') {
            const reorderdImages = [...images];
            const sourceIndex = source.index;
            const destinationIndex = destination.index;

            const [removedImage] = reorderdImages.splice(sourceIndex, 1);
            reorderdImages.splice(destinationIndex, 0, removedImage);
            return setImages(reorderdImages);
        }
    }

    const handleDeleteCheckedItems = () => {
        const filteredItems = images.filter(item => !item.checked);
        setImages(filteredItems);
    };

    const handleCheckboxChange = (itemId) => {
        setImages(images.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
        ));
    };



    const isAllSelected = () => {
        return images.every(item => item.checked);
    };

    const handleMasterCheckbox = (event) => {
        const { checked } = event.target;
        const updatedImages = images.map(item => ({ ...item, checked }));
        setImages(updatedImages);
    };



    const uploadButton = (
        <div>
            {<PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );



    const fileInputRef = useRef(null);
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (upload) => {
                const newImage = {
                    id: images.length + 1,
                    src: upload.target.result,
                    alt: file.name,
                };

                setImages([...images, newImage]);
            };

            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };




    return (
        <div className='gallery'>
            <div className='header'>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input className='select-all' type="checkbox" name="" id="" checked={isAllSelected()} onChange={handleMasterCheckbox} />
                    <label className='select-label' htmlFor=""> <span>{images.filter(item => item.checked).length}</span> Files Selected</label>
                </div>
                <div className='btn-container'>
                    <Button onClick={handleDeleteCheckedItems} type='primary' danger>Delete</Button>
                </div>
            </div>
            <DragDropContext onDragEnd={handleDragDrop}>
                <Droppable droppableId='ROOT' type='group' direction="horizontal">
                    {(provided) => (
                        <div className='all-images' {...provided.droppableProps} ref={provided.innerRef}>
                            {images.map((image, index) => (
                                <Draggable draggableId={image.id.toString()} key={image.id} index={index}>
                                    {
                                        (provided) => (
                                            <div className={index === 0 ? 'double-size image-container' : 'image-container'} {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                                <img key={image.id}
                                                    src={image.url}
                                                    alt={`Image ${index + 1}`}
                                                />
                                                <div className="overlay">
                                                    <input type="checkbox" name="" id="" className='custom-checkbox' checked={image.checked}
                                                        onChange={() => handleCheckboxChange(image.id)}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }

                                </Draggable>

                            ))}
                            <div className='upload_img_wrapper'>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                />
                                <span className='up_btn' onClick={triggerFileInput}>{uploadButton}</span>
                            </div>
                        </div>
                    )}
                </Droppable>

            </DragDropContext>

        </div>
    );
}

export default Gallery;