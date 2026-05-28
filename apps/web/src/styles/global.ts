import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-width: 320px;
    color: #f8fafc;
    background: #08110d;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    text-rendering: geometricPrecision;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    letter-spacing: 0;
  }

  ::selection {
    color: #052e16;
    background: #86efac;
  }
`;
