import React, { useState } from "react";
import ImageUploader from "react-images-upload";

const ImageUploadModal = (props) => {
  const { getImages, getDocuments } = props;
  const [pictures, setPictures] = useState([]);
  const [documents, setDocuments] = useState([]);

  React.useEffect(() => {
    getImages(pictures[pictures.length-1])
  }, [pictures])

  React.useEffect(() => {
    getDocuments(documents[documents.length-1])
  }, [documents])

  const onDrop = data => {
    if (data.type === 'application/pdf' || data.type === 'application/haansofthwp') {
      setDocuments([...documents, data])
    } else {
      setPictures([...pictures, data])
    }
  }

  return (
    <ImageUploader
      {...props}
      withIcon={true}
      withPreview={true}
      buttonText={"사진 업로드"}
      label={"최대 파일 크기 : 10MB, 가능한 확장자 : jpg, gif, png, heic, jpeg, jfif, pdf, hwp"}
      onChange={onDrop}
      fileSizeError={"파일 크기가 너무 큽니다"}
      fileTypeError={"파일의 확장자가 다릅니다"}
      imgExtension={[".jpg", ".gif", ".png", ".heic", ".jpeg", ".jfif", ".pdf", ".hwp"]}
      maxFileSize={10_000_000}
    />
  );
};

export default ImageUploadModal;