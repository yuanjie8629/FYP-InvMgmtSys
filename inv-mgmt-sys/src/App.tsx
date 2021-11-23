import React from 'react';
import ConfigProvider from 'antd/es/config-provider';
import './App.less';
import Routes from '@routes/AppRoutes';
import { Provider } from 'react-redux';
import store from './state';

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider prefixCls='shrf'>
        <Routes />
      </ConfigProvider>
    </Provider>
  );
}

export default App;
