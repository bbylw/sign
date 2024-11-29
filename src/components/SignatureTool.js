import { fabric } from 'fabric';

export class SignatureTool {
  constructor(canvasId) {
    this.canvas = new fabric.Canvas(canvasId);
    this.history = [];
    this.setupCanvas();
    this.bindEvents();
  }

  setupCanvas() {
    const container = document.querySelector('.canvas-container');
    const width = container.clientWidth;
    this.canvas.setWidth(width);
    this.canvas.setHeight(width * 0.5);
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.width = 2;
    this.canvas.freeDrawingBrush.color = '#000';
    this.canvas.backgroundColor = '#fff';
  }

  bindEvents() {
    this.canvas.on('path:created', (e) => {
      this.history.push(e.path);
    });
  }

  clear() {
    this.canvas.clear();
    this.canvas.backgroundColor = '#fff';
    this.history = [];
  }

  undo() {
    if (this.history.length > 0) {
      const lastPath = this.history.pop();
      this.canvas.remove(lastPath);
    }
  }

  setBrushSize(size) {
    this.canvas.freeDrawingBrush.width = parseInt(size, 10);
  }

  setBrushColor(color) {
    this.canvas.freeDrawingBrush.color = color;
  }

  async loadDocument(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fabric.Image.fromURL(e.target.result, (img) => {
          this.documentImage = img;
          resolve();
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async generateSignedDocument() {
    if (!this.documentImage) {
      throw new Error('请先上传文档');
    }

    return new Promise((resolve, reject) => {
      const finalCanvas = new fabric.Canvas(null);
      finalCanvas.setWidth(this.documentImage.width);
      finalCanvas.setHeight(this.documentImage.height);
      
      finalCanvas.add(this.documentImage);
      
      const signatureData = this.canvas.toDataURL();
      fabric.Image.fromURL(signatureData, (signature) => {
        signature.scale(0.5);
        signature.set({
          left: finalCanvas.width - signature.width * 0.5 - 50,
          top: finalCanvas.height - signature.height * 0.5 - 50
        });
        finalCanvas.add(signature);
        
        try {
          const dataUrl = finalCanvas.toDataURL({format: 'png'});
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
} 