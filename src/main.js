import { SignatureTool } from './components/SignatureTool.js';
import './style.css';

class App {
  constructor() {
    this.signatureTool = null;
    this.initializeUI();
    this.initializeSignatureTool();
    this.bindEvents();
  }

  initializeUI() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <h1>在线签名工具</h1>
        <div class="upload-section">
          <label for="document" class="upload-label">
            <span>上传文档</span>
            <input type="file" id="document" accept="image/*,.pdf" />
          </label>
        </div>
        <div class="signature-section">
          <h2>手写签名</h2>
          <div class="canvas-container">
            <canvas id="signatureCanvas"></canvas>
          </div>
          <div class="controls">
            <button id="clearSignature" class="btn">清除签名</button>
            <button id="undoSignature" class="btn">撤销</button>
            <div class="brush-settings">
              <label>
                笔画粗细:
                <input type="range" id="brushSize" min="1" max="10" value="2" />
              </label>
              <label>
                颜色:
                <input type="color" id="brushColor" value="#000000" />
              </label>
            </div>
          </div>
        </div>
        <div class="preview-section">
          <div id="previewContainer"></div>
        </div>
        <button id="generateSignature" class="btn primary">生成签名文档</button>
      </div>
    `;

    this.initializeSignatureTool();
    this.bindEvents();

    // 添加提示信息
    const tips = document.createElement('div');
    tips.className = 'tips';
    tips.innerHTML = `
      <h3>使用说明：</h3>
      <ol>
        <li>上传需要签名的文档（支持图片格式）</li>
        <li>在签名区域手写您的签名</li>
        <li>调整笔画粗细和颜色</li>
        <li>如果不满意可以撤销或清除重写</li>
        <li>点击"生成签名文档"完成</li>
      </ol>
    `;
    
    document.querySelector('.container').insertBefore(
      tips,
      document.querySelector('.upload-section')
    );
  }

  initializeSignatureTool() {
    const canvas = document.getElementById('signatureCanvas');
    if (canvas) {
      this.signatureTool = new SignatureTool('signatureCanvas');
    } else {
      console.error('Canvas element not found');
    }
  }

  bindEvents() {
    const documentInput = document.getElementById('document');
    const clearButton = document.getElementById('clearSignature');
    const undoButton = document.getElementById('undoSignature');
    const brushSize = document.getElementById('brushSize');
    const brushColor = document.getElementById('brushColor');
    const generateButton = document.getElementById('generateSignature');

    documentInput.addEventListener('change', this.handleDocumentUpload.bind(this));
    clearButton.addEventListener('click', () => this.signatureTool.clear());
    undoButton.addEventListener('click', () => this.signatureTool.undo());
    brushSize.addEventListener('input', (e) => this.signatureTool.setBrushSize(e.target.value));
    brushColor.addEventListener('input', (e) => this.signatureTool.setBrushColor(e.target.value));
    generateButton.addEventListener('click', this.handleGenerate.bind(this));
  }

  async handleDocumentUpload(event) {
    const file = event.target.files[0];
    if (file && this.signatureTool) {
      const loading = document.createElement('div');
      loading.className = 'loading';
      loading.textContent = '正在加载文档...';
      document.body.appendChild(loading);

      try {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('文件大小不能超过10MB');
        }
        await this.signatureTool.loadDocument(file);
      } catch (error) {
        console.error('加载文档失败:', error);
        alert(error.message || '加载文档失败，请重试');
      } finally {
        loading.remove();
      }
    } else {
      console.error('SignatureTool not initialized or no file selected');
    }
  }

  async handleGenerate() {
    try {
      const loading = document.createElement('div');
      loading.className = 'loading';
      loading.textContent = '正在生成签名文档...';
      document.body.appendChild(loading);

      const dataUrl = await this.signatureTool.generateSignedDocument();
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      this.downloadSignedDocument(blob);
    } catch (error) {
      console.error('生成签名文档失败:', error);
      alert('生成签名文档失败，请重试');
    } finally {
      document.querySelector('.loading')?.remove();
    }
  }

  downloadSignedDocument(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signed-document.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
}); 