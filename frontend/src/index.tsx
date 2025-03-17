import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import App from './score';
import { LanguageProvider } from './theme/LanguageSelect';

const templates = require.context('../public/svg', true, /\.(svg)$/);

function PreloadCards() {
  return (
    <React.Fragment>
      {templates.keys().map((path) => {
        return <link key={`pre-${path}`} rel={"preload"} href={`/svg/${path}`} as={"image"} />;
      })}
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <>
    <StyledEngineProvider injectFirst>
      <LanguageProvider >
        <App />
      </LanguageProvider>
    </StyledEngineProvider>
    <PreloadCards />
  </>
);