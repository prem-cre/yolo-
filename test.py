from fastapi import FastAPI, UploadFile, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
import json
model = YOLO("yolo12n.pt")  # or yolo12s.pt, or best.pt custom model
model.train(data="C:/Users/PREM KUMAR/Downloads/archive/marine debris object detection/data.yaml",
            epochs=100,
            imgsz=640,
            batch=8)
