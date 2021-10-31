import React from 'react';
import ConfigProvider from 'antd/es/config-provider';
import './App.less';
import Routes from '@routes/Routes';

function App() {
  return (
    <ConfigProvider prefixCls='shrf'>
      <Routes />
    </ConfigProvider>
  );
}

export default App;
