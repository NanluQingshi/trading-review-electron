/*
 * @Author: 南路情诗
 * @Date: 2026-01-20
 * @Email: nanluqingshi@gmail.com
 * @版权声明：© 2026 南路情诗 保留所有权利
 * @使用条款：未经授权，不得复制、修改、分发或用于商业目的
 */
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, ConfigProvider, Spin, Alert, Modal } from 'antd';
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
import ActivationPage from './pages/ActivationPage';
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
    if (path === '/settings') return 'settings';
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
          {!collapsed && <span style={{ fontSize: 16, fontWeight: 'bold', color: '#1f1f1f' }}>TradingReview</span>}
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
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: <Link to="/settings">设置</Link>,
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
          {/* Header内容 */}
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
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#8c8c8c' }}>
          TradingReview ©2026 Created by NanluQingshi
        </Footer>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  const [activated, setActivated] = useState<boolean | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const checkActivation = async () => {
      if (!window.electron?.activation) {
        // preload 未就绪，延迟重试
        setTimeout(checkActivation, 100);
        return;
      }
      try {
        const isActivated = await window.electron.activation.getStatus();
        setActivated(isActivated);
      } catch {
        setActivated(false);
      }
    };
    checkActivation();
  }, []);

  // 试用期倒计时逻辑：
  // - 试用开始后总时长 3 天（在 electron/config.ts 中配置）
  // - 试用结束前 30 分钟弹出提醒
  // - 试用时间到后强制返回激活页
  useEffect(() => {
    if (!activated) {
      return;
    }

    let reminderTimer: ReturnType<typeof setTimeout> | null = null;
    let expireTimer: ReturnType<typeof setTimeout> | null = null;

    const setupTrialCountdown = async () => {
      try {
        const countdown = await window.electron.activation.getTrialCountdown();
        if (!countdown || !countdown.enabled) {
          return;
        }

        const { msLeft } = countdown;

        if (msLeft <= 0) {
          Modal.info({
            title: '试用已结束',
            content: '试用期已结束，将返回激活页面。',
            onOk: () => {
              setActivated(false);
            },
          });
          setActivated(false);
          return;
        }

        const reminderMs = msLeft - 30 * 60 * 1000;

        if (reminderMs > 0) {
          reminderTimer = setTimeout(() => {
            Modal.warning({
              title: '试用即将结束',
              content:
                '当前为试用模式，试用将在 30 分钟后结束，请及时保存数据并准备回到激活页面。',
            });
          }, reminderMs);
        } else {
          // 若打开应用时已处于试用最后 30 分钟内，则立即提示
          Modal.warning({
            title: '试用即将结束',
            content:
              '当前为试用模式，试用即将结束，请及时保存数据并准备回到激活页面。',
          });
        }

        expireTimer = setTimeout(() => {
          Modal.info({
            title: '试用已结束',
            content: '试用期已结束，将返回激活页面。',
            onOk: () => {
              setActivated(false);
            },
          });
          setActivated(false);
        }, msLeft);
      } catch (error) {
        console.error('试用倒计时初始化失败:', error);
      }
    };

    setupTrialCountdown();

    return () => {
      if (reminderTimer) {
        clearTimeout(reminderTimer);
      }
      if (expireTimer) {
        clearTimeout(expireTimer);
      }
    };
  }, [activated]);

  // 监听在线/离线状态，给出全局提示
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleActivated = () => {
    setActivated(true);
  };

  // 加载中
  if (activated === null) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
        }}
      >
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  // 未激活，显示激活页面
  if (!activated) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1677ff',
            borderRadius: 6,
          },
        }}
      >
        <>
          {!isOnline && (
            <div style={{ padding: 16 }}>
              <Alert
                type="warning"
                message="当前处于离线状态，激活功能需要联网，请检查网络后重试。"
                showIcon
              />
            </div>
          )}
          <ActivationPage onActivated={handleActivated} />
        </>
      </ConfigProvider>
    );
  }

  // 已激活，显示主应用（本地使用为主，不再全局提示离线，仅在激活页提示）
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