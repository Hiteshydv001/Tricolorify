import React, { useRef } from 'react';
import styles from '../styles/Home.module.css';

export default function FileUpload({ onFileChange }) {
  const fileInput = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={styles.uploadBox}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      onClick={() => fileInput.current.click()}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInput}
        style={{ display: 'none' }}
        onChange={e => onFileChange(e.target.files[0])}
      />
      <p>Drag & drop or <span className={styles.uploadLink}>click to upload</span> your photo</p>
    </div>
  );
}
