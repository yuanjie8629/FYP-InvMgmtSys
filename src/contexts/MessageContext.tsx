import { message } from 'antd';
import React, { createContext } from 'react';

export const MessageContext = createContext(null);

export const MessageProvider = (props) => {
  const [messageApi, messageContext] = message.useMessage();

  message.config({
    maxCount: 1,
    duration: 5,
  });

  return (
    <MessageContext.Provider value={[messageApi]}>
      {messageContext}
      {props.children}
    </MessageContext.Provider>
  );
};
