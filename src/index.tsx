/*
 * @Author: 南路情诗
 * @Date: 2026-01-20
 * @Email: nanluqingshi@gmail.com
 * @版权声明：© 2026 南路情诗 保留所有权利
 * @使用条款：未经授权，不得复制、修改、分发或用于商业目的
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'antd/dist/reset.css';
import '@styles/index.css';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
