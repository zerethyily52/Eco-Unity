import { registerRootComponent } from 'expo';
import App from './App';
import Wrapper from './wrapper';

const config = {
    api: 'https://bclicstore.store/getlemons',
  };
  
registerRootComponent(Wrapper(App, config));
