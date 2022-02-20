import React from 'react';
import ConfigProvider from 'antd/es/config-provider';
import './App.less';
import Routes from '@routes/AppRoutes';
import { Provider } from 'react-redux';
import store from './state';
import { IconContext } from 'react-icons/lib';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider prefixCls='shrf'>
        <ApolloProvider client={client}>
          <IconContext.Provider
            value={{ style: { verticalAlign: 'middle', textAlign: 'center' } }}
          >
            <Routes />
          </IconContext.Provider>
        </ApolloProvider>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
