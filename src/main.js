import { SignatureTool } from './components/SignatureTool.js';
import './style.css';

class App {
  constructor() {
    this.signatureTool = null;
    this.initializeUI();
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
          <h2>签名</h2>
          <div class="signature-type-switch">
            <button id="handwriteMode" class="btn mode-btn active">手写签名</button>
            <button id="textMode" class="btn mode-btn">文字签名</button>
          </div>
          
          <!-- 手写签名区域 -->
          <div id="handwriteArea" class="signature-area">
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
          
          <!-- 文字签名区域 -->
          <div id="textArea" class="signature-area" style="display: none;">
            <div class="text-input-container">
              <input type="text" id="signatureText" placeholder="输入您的签名文字" class="signature-text-input" />
              <div class="text-controls">
                <label>
                  字体大小:
                  <input type="range" id="fontSize" min="20" max="80" value="40" />
                </label>
                <label>
                  字体样式:
                  <select id="fontFamily" class="font-select">
                    <option value="ZCOOL XiaoWei">中文手写体</option>
                    <option value="Ma Shan Zheng">毛笔字体</option>
                    <option value="Dancing Script">英文手写体 1</option>
                    <option value="Caveat">英文手写体 2</option>
                    <option value="Pacifico">英文手写体 3</option>
                    <option value="Permanent Marker">英文马克笔</option>
                  </select>
                </label>
                <label>
                  颜色:
                  <input type="color" id="textColor" value="#000000" />
                </label>
              </div>
            </div>
            <div id="textPreview" class="text-preview"></div>
          </div>
        </div>
        <div class="preview-section">
          <div id="previewContainer"></div>
        </div>
        <button id="generateSignature" class="btn primary">生成签名文档</button>
      </div>
    `;

    setTimeout(() => {
      this.initializeSignatureTool();
      this.bindEvents();
    }, 0);

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

    // 添加模式切换事件
    const handwriteMode = document.getElementById('handwriteMode');
    const textMode = document.getElementById('textMode');
    const handwriteArea = document.getElementById('handwriteArea');
    const textArea = document.getElementById('textArea');

    handwriteMode.addEventListener('click', () => {
      handwriteMode.classList.add('active');
      textMode.classList.remove('active');
      handwriteArea.style.display = 'block';
      textArea.style.display = 'none';
      this.signatureTool.setSignatureMode('handwrite');
    });

    textMode.addEventListener('click', () => {
      textMode.classList.add('active');
      handwriteMode.classList.remove('active');
      textArea.style.display = 'block';
      handwriteArea.style.display = 'none';
      this.signatureTool.setSignatureMode('text');
    });

    // 文字签名预览
    const signatureText = document.getElementById('signatureText');
    const fontSize = document.getElementById('fontSize');
    const fontFamily = document.getElementById('fontFamily');
    const textColor = document.getElementById('textColor');
    const textPreview = document.getElementById('textPreview');

    const updateTextPreview = () => {
      textPreview.style.fontFamily = fontFamily.value;
      textPreview.style.fontSize = `${fontSize.value}px`;
      textPreview.style.color = textColor.value;
      textPreview.textContent = signatureText.value || '预览签名效果';
    };

    signatureText.addEventListener('input', updateTextPreview);
    fontSize.addEventListener('input', updateTextPreview);
    fontFamily.addEventListener('change', updateTextPreview);
    textColor.addEventListener('input', updateTextPreview);
  }

  async handleDocumentUpload(event) {
    const file = event.target.files[0];
    console.log('选择的文件:', file);
    
    if (file && this.signatureTool) {
      const loading = document.createElement('div');
      loading.className = 'loading';
      loading.textContent = '正在加载文档...';
      document.body.appendChild(loading);

      try {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('文件大小不能超过10MB');
        }
        console.log('开始处理文件');
        
        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
          throw new Error('不支持的文件类型，请上传图片或PDF文件');
        }
        
        await this.signatureTool.loadDocument(file);
        console.log('文件处理完成');
      } catch (error) {
        console.error('加载文档失败:', error);
        alert(error.message || '加载文档失败，请重试');
      } finally {
        loading.remove();
      }
    } else {
      if (!this.signatureTool) {
        console.error('SignatureTool未初始化');
        alert('系统初始化失败，请刷新页面重试');
      } else if (!file) {
        console.error('未选择文件');
        alert('请选择要上传的文件');
      }
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
  window.app = new App();
}); 