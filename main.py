from fastapi import FastAPI, UploadFile, Response
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np

app = FastAPI()

# CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your trained model
model = YOLO("yolov8m.pt")


# Global variable to store detections
last_detections = []

@app.post("/upload")
async def upload(file: UploadFile):
    global last_detections
    last_detections = []

    # Read image as bytes
    img_bytes = await file.read()
    np_img = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    # Run YOLO
    results = model(img, conf=0.05)[0]



    # Extract detections
    for box in results.boxes:
        cls_id = int(box.cls)
        label = model.names[cls_id]
        conf = float(box.conf)
        last_detections.append({
            "class": label,
            "confidence": conf
        })

    # Get annotated image
    annotated = results.plot()

    _, buffer = cv2.imencode(".jpg", annotated)
    return Response(content=buffer.tobytes(), media_type="image/jpeg")


@app.get("/detections")
def get_detections():
    return last_detections
