# Online Signature Tool | 在线签名工具

[English](#english) | [中文](#中文)

# English

A web-based online signature tool that supports both handwritten and text signatures for PDF and image documents.

## Features

- Support both handwritten and text signatures
- Multiple handwriting style fonts available
- Draggable signature positioning
- Support PDF and image documents
- Adjustable signature size and color
- Real-time preview
- Mobile device support

## Tech Stack

- Fabric.js - Canvas manipulation and image processing
- PDF.js - PDF file handling
- Google Fonts - Handwriting style fonts
- Vite - Build tool

## Deploy to Cloudflare Pages

### 1. Prerequisites

1. Create a GitHub account (if you don't have one)
2. Fork or clone this repository
3. Create a Cloudflare account (if you don't have one)

### 2. Deployment Steps

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to Pages
3. Click "Create a project"
4. Select "Connect to Git"
5. Choose your repository
6. Configure build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
7. Click "Save and Deploy"

You'll get a `*.pages.dev` domain after deployment.

### 3. Custom Domain (Optional)

1. Click "Custom domains" in project settings
2. Add your domain
3. Follow the DNS configuration instructions

## Usage Guide

1. Upload Document
   - Click "Upload Document" button
   - Select PDF or image file (PNG, JPG supported)
   - File size limit: 10MB

2. Create Signature
   - Handwritten: Draw directly on canvas
   - Text: Enter text and choose font style
   - Adjust signature color and size

3. Position Signature
   - Drag signature to desired position in preview area
   - Freely adjust signature placement

4. Generate Document
   - Click "Generate Signed Document"
   - Signed document will download automatically

## Notes

- Recommended browsers: Chrome, Firefox, Edge
- Ensure browser allows file downloads
- PDF signing supports first page only
- Stable internet connection required

---

# 中文

一个基于 Web 的在线签名工具，支持在 PDF 和图片文档上添加手写签名和文字签名。

## 功能特点

- 支持手写签名和文字签名两种模式
- 提供多种手写风格字体
- 支持签名位置自由拖拽
- 支持 PDF 和图片格式文档
- 支持调整签名大小、颜色
- 实时预览效果
- 支持移动端使用

## 技术栈

- Fabric.js - 用于画布操作和图像处理
- PDF.js - 用于 PDF 文件处理
- Google Fonts - 提供手写风格字体
- Vite - 构建工具

## 部署到 Cloudflare Pages

### 1. 准备工作

1. 创建 GitHub 账号（如果没有）
2. Fork 或克隆此仓库
3. 创建 Cloudflare 账号（如果没有）

### 2. 部署步骤

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 Pages 页面
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 选择你的仓库
6. 配置构建设置：
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
7. 点击 "Save and Deploy"

部署完成后，你会得到一个 `*.pages.dev` 的域名。

### 3. 自定义域名（可选）

1. 在项目设置中点击 "Custom domains"
2. 添加你的域名
3. 按照提示配置 DNS 记录

## 使用说明

1. 上传文档
   - 点击"上传文档"按钮
   - 选择 PDF 或图片文件（支持 PNG、JPG 等格式）
   - 文件大小限制为 10MB

2. 创建签名
   - 手写签名：直接在画布上绘制
   - 文字签名：输入文字并选择字体样式
   - 可调整签名颜色和大小

3. 调整签名位置
   - 在预览区域拖动签名到合适位置
   - 签名位置可自由调整

4. 生成文档
   - 点击"生成签名文档"
   - 自动下载带签名的文档

## 注意事项

- 推荐使用现代浏览器（Chrome、Firefox、Edge 等）
- 确保浏览器允许下载文件
- PDF 文件仅支持第一页签名
- 请确保有稳定的网络连接

## License | 许可证

MIT