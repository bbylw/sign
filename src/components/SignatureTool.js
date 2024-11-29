import { fabric } from 'fabric';
import * as pdfjsLib from 'pdfjs-dist';

// 设置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export class SignatureTool {
  constructor(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      throw new Error('Canvas element not found');
    }
    
    this.canvas = new fabric.Canvas(canvasId);
    this.history = [];
    this.setupCanvas();
    this.bindEvents();
    
    // 添加窗口大小变化的响应
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    const container = document.querySelector('.canvas-container');
    const width = container.clientWidth;
    this.canvas.setWidth(width);
    this.canvas.setHeight(width * 0.5);
    this.canvas.renderAll();
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

  // 添加预览功能
  async loadDocument(file) {
    if (file.type === 'application/pdf') {
      return this.loadPDF(file);
    } else {
      return this.loadImage(file);
    }
  }

  async loadPDF(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1); // 获取第一页
      
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      
      // 创建 canvas 用于渲染 PDF
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      const context = canvas.getContext('2d');
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // 显示预览
      const previewContainer = document.getElementById('previewContainer');
      previewContainer.innerHTML = '';
      previewContainer.appendChild(canvas);
      
      // 保存文档信息
      this.documentImage = new fabric.Image(canvas);
      
      return Promise.resolve();
    } catch (error) {
      console.error('PDF 加载失败:', error);
      throw new Error('PDF 加载失败，请重试');
    }
  }

  async loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fabric.Image.fromURL(e.target.result, (img) => {
          this.documentImage = img;
          
          // 在预览区域显示文档
          const previewContainer = document.getElementById('previewContainer');
          const preview = document.createElement('img');
          preview.src = e.target.result;
          preview.style.maxWidth = '100%';
          previewContainer.innerHTML = '';
          previewContainer.appendChild(preview);
          
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