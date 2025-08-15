import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import NewCatchTricolor from '../components/NewGame';
import ImagePreview from '../components/ImagePreview';
import DownloadButton from '../components/DownloadButton';
import styles from '../styles/Home.module.css';
import axios from 'axios';

// Confetti animation
function Confetti() {
  useEffect(() => {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    let mp = 120; // max particles
    let particles = [];
    for(let i = 0; i < mp; i++) {
      particles.push({
        x: Math.random()*W,
        y: Math.random()*H,
        r: Math.random()*8+2,
        d: Math.random()*mp,
        color: ["#FF9933", "#FFFFFF", "#138808"][Math.floor(Math.random()*3)],
        tilt: Math.floor(Math.random()*10)-10
      });
    }
    function draw() {
      ctx.clearRect(0,0,W,H);
      for(let i = 0; i < mp; i++) {
        let p = particles[i];
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r/3, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();
      }
      update();
    }
    let angle = 0;
    function update() {
      angle += 0.01;
      for(let i = 0; i < mp; i++) {
        let p = particles[i];
        p.y += (Math.cos(angle+p.d) + 1 + p.r/2)/2;
        p.x += Math.sin(angle);
        if(p.x > W+20 || p.x < -20 || p.y > H) {
          if(i%3 > 0) {
            particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d, color: p.color, tilt: p.tilt};
          } else {
            if(Math.sin(angle) > 0) {
              particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d, color: p.color, tilt: p.tilt};
            } else {
              particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d, color: p.color, tilt: p.tilt};
            }
          }
        }
      }
    }
    let anim;
    function loop() {
      draw();
      anim = requestAnimationFrame(loop);
    }
    loop();
    window.addEventListener('resize', () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    });
    return () => cancelAnimationFrame(anim);
  }, []);
  return <canvas id="confetti-canvas" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',pointerEvents:'none',zIndex:0}}></canvas>;
}

export default function Home() {
  const [original, setOriginal] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processed, setProcessed] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add Google Fonts dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleFileChange = (file) => {
    setOriginal(file);
    setPreview(URL.createObjectURL(file));
    setProcessed(null);
  };

  const handleProcess = async () => {
    if (!original) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', original);
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + '/tricolor',
        formData,
        { responseType: 'blob' }
      );
      setProcessed(URL.createObjectURL(res.data));
    } catch (e) {
      alert('Failed to process image.');
    }
    setLoading(false);
  };

  // Floating Ashoka Chakra
  const chakraUrl = '/ashoka_chakra_ui.png'; // Place a PNG in public folder for UI

  return (
    <>
      <Confetti />
      <div className={styles.bgFlag}></div>
      <div className={styles.container}>
        <div className={styles.heroSection}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>🇮🇳 Independence Day Special</div>
            <h1 className={styles.heroTitle}>
              <span>Make Your </span>
              <span className={styles.greenText}>Patriotic</span>
              <span> Profile </span>
              <span className={styles.orangeText}>Photo</span>
              <span> Instantly!</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Upload your photo and get a stunning tricolor overlay with Ashoka Chakra.<br/>
              Celebrate <span className={styles.greenText}>Independence Day</span> in style!
            </p>
            <div className={styles.heroFeatures}>
              <div className={styles.featureBadge}><span role="img" aria-label="bolt">⚡</span> 1-Click Magic</div>
              <div className={styles.featureBadge}><span role="img" aria-label="palette">🎨</span> Tricolor Overlay</div>
              <div className={styles.featureBadge}><span role="img" aria-label="chakra">🟦</span> Ashoka Chakra</div>
              <div className={styles.featureBadge}><span role="img" aria-label="download">⬇️</span> Instant Download</div>
            </div>
            <div className={styles.heroActions}>
              <FileUpload onFileChange={handleFileChange} />
              {original && (
                <button className={styles.processBtn} onClick={handleProcess} disabled={loading}>
                  {loading ? 'Processing...' : 'Apply Tricolor Overlay'}
                </button>
              )}
            </div>
          </div>
          <div className={styles.heroRight}>
            <img src="/indian-armed-forces.jpg" alt="Indian Armed Forces" className={styles.heroImage} />
            <div className={styles.heroPreviewCard}>
              <ImagePreview src={preview} label="Original Preview" />
              <ImagePreview src={processed} label="Processed Preview" />
              <DownloadButton imageUrl={processed} />
            </div>
          </div>
        </div>
        
        <div style={{ 
          width: '100%',
          margin: '2rem 0'
        }}>
          <NewCatchTricolor />
        </div>

        <footer className={styles.footer}>
          <span>Made with ❤️ for India | 15th August</span>
        </footer>
      </div>
      <style>{`
        @keyframes chakra-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}
