import ConfigProvider from 'antd/es/config-provider';
import './App.less';
import Routes from '@routes/AppRoutes';
import { IconContext } from 'react-icons/lib';
import { message } from 'antd';

function App() {
  message.config({ top: 80 });
  return (
    <ConfigProvider prefixCls='shrf'>
      <IconContext.Provider
        value={{ style: { verticalAlign: 'middle', textAlign: 'center' } }}
      >
        <Routes />
      </IconContext.Provider>
    </ConfigProvider>
  );
}

export default App;
