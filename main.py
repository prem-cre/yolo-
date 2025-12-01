from fastapi import FastAPI, UploadFile, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLO v12 pretrained model (replace with your model path if custom e.g. best.pt)
model = YOLO("yolo12n.pt")  # or yolo12s.pt / yolo12m.pt / your_model.pt

@app.post("/upload")
async def upload(file: UploadFile):
    try:
        img_bytes = await file.read()
        np_img = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Run inference — multiple predictions supported
        results = model.predict(source=img, conf=0.5, imgsz=640)[0]

        detections = []
        for box in results.boxes:
            detections.append({
                "class": results.names[int(box.cls)],
                "confidence": float(box.conf)
            })

        # Draw bounding boxes on image
        annotated = results.plot()

        _, buffer = cv2.imencode(".jpg", annotated)

        return Response(
            content=buffer.tobytes(),
            media_type="image/jpeg",
            headers={"detections": json.dumps(detections)}
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")
