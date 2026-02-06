/*
 * @Author: 南路情诗
 * @Date: 2026-01-20
 * @Email: nanluqingshi@gmail.com
 * @版权声明：© 2026 南路情诗 保留所有权利
 * @使用条款：未经授权，不得复制、修改、分发或用于商业目的
 */
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, ConfigProvider } from 'antd';
import { 
  BookOutlined, 
  LineChartOutlined, 
  BarChartOutlined,
  DashboardOutlined,
  GithubOutlined
} from '@ant-design/icons';
import MethodsPage from './pages/MethodsPage';
import TradesPage from './pages/TradesPage';
import StatsPage from './pages/StatsPage';
import '@styles/App.css';

const { Header, Content, Footer, Sider } = Layout;

const AppContent: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  // 根据当前路径确定选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return 'methods';
    if (path === '/trades') return 'trades';
    if (path === '/stats') return 'stats';
    return 'methods';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '16px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <DashboardOutlined style={{ fontSize: 24, color: '#1677ff', marginRight: collapsed ? 0 : 8 }} />
          {!collapsed && <span style={{ fontSize: 16, fontWeight: 'bold', color: '#1f1f1f' }}>交易复盘系统</span>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={[
            {
              key: 'methods',
              icon: <BookOutlined />,
              label: <Link to="/">Method 库</Link>,
            },
            {
              key: 'trades',
              icon: <LineChartOutlined />,
              label: <Link to="/trades">交易复盘</Link>,
            },
            {
              key: 'stats',
              icon: <BarChartOutlined />,
              label: <Link to="/stats">我的统计</Link>,
            },
          ]}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{ 
          position: 'fixed', 
          width: `calc(100% - ${collapsed ? 80 : 200}px)`,
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          zIndex: 1
        }}>
          <a href="https://github.com/NanluQingshi/trading-review-system" target="_blank" rel="noreferrer" style={{ color: '#000', fontSize: 20 }}>
            <GithubOutlined />
          </a>
        </Header>
        <Content style={{ margin: '80px 16px', overflow: 'initial' }}>
          <div style={{ 
            padding: 24, 
            background: '#fff', 
            borderRadius: 8,
            minHeight: 'calc(100vh - 160px)',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03),0 1px 6px -1px rgba(0,0,0,0.02),0 2px 4px 0 rgba(0,0,0,0.02)'
          }}>
            <Routes>
              <Route path="/" element={<MethodsPage />} />
              <Route path="/trades" element={<TradesPage />} />
              <Route path="/stats" element={<StatsPage />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#8c8c8c' }}>
          Trading Review System ©2026 Created by NanluQingshi
        </Footer>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <Router>
        <AppContent />
      </Router>
    </ConfigProvider>
  );
};

export default App;