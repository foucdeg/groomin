import React from 'react';

import { BrowserRouter } from 'react-router-dom';
import { NoProps } from 'services/utils';
import AppCrashFallback from './components/AppCrashFallback';
import ErrorBoundary from './components/ErrorBoundary';
import Root from './components/Root';
import Routes from './routes';

const App: React.FunctionComponent<NoProps> = () => (
  <ErrorBoundary FallbackComponent={AppCrashFallback}>
    <BrowserRouter>
      <Root>
        <Routes />
      </Root>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
