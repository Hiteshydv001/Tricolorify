import React from 'react';
import styles from '../styles/Home.module.css';

export default function ImagePreview({ src, label }) {
  if (!src) return null;
  return (
    <div className={styles.previewBox}>
      <p>{label}</p>
      <img src={src} alt={label} className={styles.previewImg} />
    </div>
  );
}
