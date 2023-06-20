import sys
import traceback
import logging
import json
import requests

logger = logging.getLogger()

def upload_image():
    url = "https://jzsggwpl40.execute-api.us-east-1.amazonaws.com/processImage"
    data = json.dumps({"image": open("exampleB64Image.txt", "r").read()})
    response = requests.post(url, data=data)
    return response

print(upload_image().json())