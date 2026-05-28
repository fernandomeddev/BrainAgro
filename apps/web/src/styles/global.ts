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

  .Toastify__toast-container {
    width: min(420px, calc(100vw - 32px));
    z-index: 80;
  }

  .Toastify__toast {
    border: 1px solid rgba(90, 130, 100, 0.18);
    border-radius: 16px;
    padding: 14px 16px;
    color: #f8fafc;
    background:
      linear-gradient(180deg, rgba(16, 26, 22, 0.98), rgba(13, 21, 17, 0.96)),
      #101a16;
    box-shadow: 0 24px 90px rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(14px);
    font-weight: 700;
  }

  .Toastify__toast--success {
    border-color: rgba(34, 197, 94, 0.34);
  }

  .Toastify__toast--error {
    border-color: rgba(248, 113, 113, 0.38);
  }

  .Toastify__toast-icon svg {
    fill: #22c55e;
  }

  .Toastify__toast--error .Toastify__toast-icon svg {
    fill: #f87171;
  }

  .Toastify__close-button {
    align-self: center;
    color: #94a3b8;
    opacity: 1;
  }
`;
