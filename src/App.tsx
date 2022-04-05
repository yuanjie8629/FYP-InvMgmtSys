import ConfigProvider from 'antd/es/config-provider';
import './App.less';
import Routes from '@routes/AppRoutes';
import { IconContext } from 'react-icons/lib';
import { NotificationProvider } from '@contexts/NotificationContext';
import { MessageProvider } from '@contexts/MessageContext';

function App() {
  return (
    <ConfigProvider prefixCls='shrf'>
      <IconContext.Provider
        value={{ style: { verticalAlign: 'middle', textAlign: 'center' } }}
      >
        <MessageProvider>
          <NotificationProvider>
            <Routes />
          </NotificationProvider>
        </MessageProvider>
      </IconContext.Provider>
    </ConfigProvider>
  );
}

export default App;
