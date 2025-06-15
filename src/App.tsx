
import { Provider } from 'react-redux';
import { store } from './app/store/store';
import './App.css';
import { AppRouter } from './app/router/router';

function App() {

  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;
