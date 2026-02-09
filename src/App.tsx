/*
 * @Author: 南路情诗
 * @Date: 2026-01-20
 * @Email: nanluqingshi@gmail.com
 * @版权声明：© 2026 南路情诗 保留所有权利
 * @使用条款：未经授权，不得复制、修改、分发或用于商业目的
 */
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, ConfigProvider } from 'antd';
import { 
  BookOutlined, 
  LineChartOutlined, 
  BarChartOutlined,
  DashboardOutlined,
  SettingOutlined
} from '@ant-design/icons';
import MethodsPage from './pages/MethodsPage';
import TradesPage from './pages/TradesPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';

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
    if (path === '/settings') return 'settings';
    return 'methods';
  };



  return (
    <Layout className="app-layout">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        className="app-sider"
      >
        <div className="sider-header">
          <DashboardOutlined className="logo-icon" style={{ marginRight: collapsed ? 0 : 8 }} />
          {!collapsed && <span className="logo-text">TradingReview</span>}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          className="app-menu"
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
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: <Link to="/settings">设置</Link>,
            },
          ]}
        />
      </Sider>
      <Layout className={`app-main ${collapsed ? 'collapsed' : ''}`}>
        <Header className="app-header">
          {/* Header内容 */}
        </Header>
        <Content className="app-content">
          <div className="content-container">
            <Routes>
              <Route path="/" element={<MethodsPage />} />
              <Route path="/trades" element={<TradesPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </Content>
        <Footer className="app-footer">
          TradingReview ©2026 Created by NanluQingshi
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