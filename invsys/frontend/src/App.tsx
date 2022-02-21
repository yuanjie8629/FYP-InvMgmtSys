import React from 'react';
import ConfigProvider from 'antd/es/config-provider';
import './App.less';
import Routes from '@routes/AppRoutes';
import { Provider } from 'react-redux';
import store from './state';
import { IconContext } from 'react-icons/lib';

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider prefixCls='shrf'>
        <IconContext.Provider
          value={{ style: { verticalAlign: 'middle', textAlign: 'center' } }}
        >
          <Routes />
        </IconContext.Provider>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
