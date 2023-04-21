from flask import Flask, request, jsonify, render_template
import requests
from io import BytesIO
from PIL import Image
import base64
import os

bg_color = (58, 160, 245)
size = (300,300)
# size = (138,177)

app = Flask(__name__)

@app.route('/')  
def home():  
  return render_template("index.html")  

@app.route('/removebg', methods=['POST'])
def remove_bg():
    # get image from request
    # img_file = os.path.join(os.getcwd(), 'static/me.jpeg')
    img_file = request.files['image']
    img = Image.open(BytesIO(img_file.read()))
    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    img_bytes = buffered.getvalue()
    
    # send image to remove.bg API
    api_key = 'VtgaPC1vsC1EwynXE6apQvmw'
    response = requests.post(
        'https://api.remove.bg/v1.0/removebg',
        files={'image_file': img_bytes},
        data={'size': 'auto'},
        headers={'X-Api-Key': api_key},
    )

    # get transparent image
    img_transparent = Image.open(BytesIO(response.content))

    # create new solid background
    # bg_color = (112,183,255)  # white background
    img_with_bg = Image.new("RGB", img_transparent.size, bg_color)
    img_with_bg.paste(img_transparent, mask=img_transparent)

    # resize image to 500x500
    img_resized = img_with_bg.resize(size)

    # encode image as base64 string
    buffered = BytesIO()
    img_resized.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

    # return image as JSON response
    return jsonify({'image': img_str})
    
    # if response.status_code == requests.codes.ok:
    #   with open('no-bg.png', 'wb') as out:
    #     out.write(response.content)
    # return jsonify({'message':'ok'})

if __name__ == '__main__':
    app.run(debug=True)
