from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from image_processing import apply_tricolor_overlay
import io
import os
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({'message': 'Independence Day Image API is running.'})

@app.route('/tricolor', methods=['POST'])
def tricolor():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    file = request.files['image']
    try:
        image = Image.open(file.stream).convert('RGBA')
        processed = apply_tricolor_overlay(image, add_chakra=True)
        img_io = io.BytesIO()
        processed.save(img_io, 'JPEG', quality=95)
        img_io.seek(0)
        return send_file(img_io, mimetype='image/jpeg')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
