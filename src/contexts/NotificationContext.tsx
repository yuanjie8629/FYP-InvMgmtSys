import { notification } from 'antd';
import React, { createContext } from 'react';

export const NotificationContext = createContext(null);

export const NotificationProvider = (props) => {
  const [notificationAPI, notificationContext] = notification.useNotification();

  notification.config({
    maxCount: 1,
    placement: 'bottomRight',
    duration: 5,
  });

  return (
    <NotificationContext.Provider value={[notificationAPI]}>
      {notificationContext}
      {props.children}
    </NotificationContext.Provider>
  );
};
