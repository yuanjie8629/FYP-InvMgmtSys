import { notification } from 'antd';
import React, { createContext } from 'react';

export const NotificationContext = createContext(null);

export const Provider = (props) => {
  const [notificationAPI] = notification.useNotification();

  return (
    <NotificationContext.Provider value={[notificationAPI]}>
      {props.children}
    </NotificationContext.Provider>
  );
};
