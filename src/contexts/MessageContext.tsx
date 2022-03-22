import { message } from 'antd';
import { MessageInstance } from 'antd/lib/message';
import React, { createContext } from 'react';

export const MessageContext =
  createContext<
    [
      MessageInstance,
      React.ReactElement<any, string | React.JSXElementConstructor<any>>
    ]
  >(null);

export const Provider = (props) => {
  const [messageApi, context] = message.useMessage();

  return (
    <MessageContext.Provider value={[messageApi, context]}>
      {context}
      {props.children}
    </MessageContext.Provider>
  );
};
