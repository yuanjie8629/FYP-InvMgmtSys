import { notification } from 'antd';
import React, { createContext } from 'react';

export const NotificationContext = createContext(null);

export const NotificationProvider = (props) => {
  const [notificationAPI] = notification.useNotification();

  notification.config({
    maxCount: 1,
    placement: 'bottomRight',
    duration: 5,
  });

  return (
    <NotificationContext.Provider value={[notificationAPI]}>
      {props.children}
    </NotificationContext.Provider>
  );
};
