from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
import cv2
import onnxruntime as ort
import numpy as np
import random
import os
import shutil
import tempfile

app = FastAPI()

# Load ONNX model
model_path = "best.onnx"
session = ort.InferenceSession(model_path)
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

@app.post("/process_video/")
async def process_video(file: UploadFile):
    # Create a temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_path = os.path.join(temp_dir, file.filename)

        # Save the uploaded file to a temporary location
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Open the video using OpenCV
        video = cv2.VideoCapture(temp_path)

        # Static coordinates for the video location
        video_lat, video_lng = 25.788171416737896, 55.988832614656125

        detected_objects = []  # To store detected objects
        while True:
            ret, frame = video.read()
            if not ret:
                break

            # Preprocess frame for the ONNX model
            blob = cv2.dnn.blobFromImage(frame, 1 / 255.0, (640, 640), swapRB=True, crop=False)
            outputs = session.run([output_name], {input_name: blob})[0]

            # Parse detections (adjust based on your model's output format)
            for det in outputs[0]:
                confidence = det[4]
                if confidence > 0.5:  # Filter low-confidence detections
                    class_id = int(det[5])  # Replace with class mappings if available
                    detected_objects.append({
                        "name": f"object_{class_id}",  # Replace with actual object names if available
                        "lat": video_lat + random.uniform(-0.0001, 0.0001),  # Add minor variations for realism
                        "lng": video_lng + random.uniform(-0.0001, 0.0001)
                    })

        video.release()
        return JSONResponse({"objects": detected_objects})
