
import { Provider } from 'react-redux';
import { store } from './app/store/store';
import './App.css';
import { AppRouter } from './app/router/router';
import { ConfigProvider } from 'antd';
import { myCustomTheme } from '@shared/constants/theme';
import { SessionInit } from './processes/session/SessionInit';

function App() {

  return (
    <Provider store={store}>
      <ConfigProvider theme={myCustomTheme}>
        <SessionInit />
        <AppRouter />
      </ConfigProvider>
    </Provider>
  );
}

export default App;
