import * as ReactDOM from 'react-dom/client';
import { CompilerSidebar } from './CompilerSidebar';
import { GeneralSidebar } from './GeneralSidebar';

import './index.module.css';

const App = () => {
  const { viewId = '' } = window.process;

  if (viewId === 'compilerView') {
    return <CompilerSidebar />;
  }

  if (viewId === 'generalView') {
    return <GeneralSidebar />;
  }

  return <span>Empty view!</span>;
};

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(<App />);
