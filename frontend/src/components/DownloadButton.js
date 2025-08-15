import React from 'react';
import styles from '../styles/Home.module.css';

export default function DownloadButton({ imageUrl }) {
  if (!imageUrl) return null;
  return (
    <a
      href={imageUrl}
      download="independence_day_photo.jpg"
      className={styles.downloadBtn}
    >
      Download & Share 🇮🇳
    </a>
  );
}
