# 🇮🇳 Tricolorify - Independence Day Special

![Independence Day](public/indian-armed-forces.jpg)

A patriotic web application to celebrate India's Independence Day! Create stunning tricolor profile pictures and play an engaging Independence Day themed game.

## ✨ Features

### 1. Tricolor Profile Picture Generator
- **One-Click Magic**: Instantly add a tricolor overlay to your photos
- **Ashoka Chakra Integration**: Beautifully placed Ashoka Chakra on your images
- **High-Quality Processing**: Maintains image quality while adding effects
- **Instant Download**: Download your processed image immediately

### 2. Independence Day Game
- **Catch the Tricolor**: An engaging game where you catch falling tricolor balloons
- **Score Points**: Get points for catching tricolor balloons
- **Avoid Black Balloons**: Dodge the black balloons to maintain your score
- **Time Challenge**: Complete the challenge within 60 seconds

## 🚀 Tech Stack

### Frontend
- **Next.js** - React framework for production
- **CSS Modules** - Scoped styling with modern CSS
- **Axios** - HTTP client for API requests
- **React Hooks** - For state management and side effects

### Backend
- **Flask** - Python web framework
- **OpenCV** - Image processing and manipulation
- **NumPy** - Numerical computations for image processing
- **Pillow** - Python Imaging Library

### Deployment
- **Render** - Backend hosting and API services
- **Vercel** - Frontend deployment and static hosting

## 🛠️ Setup and Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hiteshydv001/Tricolorify.git
   cd Tricolorify
   ```

2. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   # Create .env.local with the following content:
   # NEXT_PUBLIC_API_URL=http://localhost:5000
   npm run dev
   ```

3. **Set up the backend**
   ```bash
   cd backend
   pip install -r requirements.txt
   # Make sure ashoka_chakra.png is in backend/static/
   python app.py
   ```

## 🎮 How to Play the Game

1. Click the "Start Game" button to begin
2. Move your basket using the mouse
3. Catch the tricolor balloons to score points:
   - Tricolor balloon = +10 points
   - Black balloon = -5 points
4. Try to get the highest score within 60 seconds!

## 🖼️ How to Use the Profile Picture Generator

1. Click "Choose File" to upload your photo
2. Click "Apply Tricolor Overlay" to process your image
3. Wait for the magic to happen
4. Click "Download" to save your patriotic profile picture

## 🌟 Contributing

Feel free to contribute to this project:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Indian Armed Forces images used with respect
- Inspired by the spirit of Independence Day
- Thanks to all contributors and users

---

Made with ❤️ for India | Happy Independence Day! 🇮🇳
