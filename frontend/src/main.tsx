import React from 'react';
import ReactDOM from 'react-dom/client';
import { Buffer } from 'buffer';
import App from './App';
import './index.css';

// 为浏览器环境添加 Buffer polyfill
window.Buffer = Buffer;

console.log('🚀 加载完整应用...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

