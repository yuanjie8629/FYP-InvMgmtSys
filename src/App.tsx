import ConfigProvider from 'antd/es/config-provider';
import './App.less';
import Routes from '@routes/AppRoutes';
import { IconContext } from 'react-icons/lib';
import { message, notification } from 'antd';
import { NotificationContext } from '@contexts/NotificationContext';
import { MessageContext } from '@contexts/MessageContext';

function App() {
  const [messageApi, messageContext] = message.useMessage();
  const [notificationAPI, notiContext] = notification.useNotification();
  message.config({
    maxCount: 1,
    duration: 5,
  });

  notification.config({
    maxCount: 1,
    placement: 'bottomRight',
    duration: 5,
  });
  return (
    <ConfigProvider prefixCls='shrf'>
      <IconContext.Provider
        value={{ style: { verticalAlign: 'middle', textAlign: 'center' } }}
      >
        <MessageContext.Provider value={[messageApi, messageContext]}>
          {messageContext}
          <NotificationContext.Provider value={[notificationAPI, notiContext]}>
            {notiContext}
            <Routes />
          </NotificationContext.Provider>
        </MessageContext.Provider>
      </IconContext.Provider>
    </ConfigProvider>
  );
}

export default App;
