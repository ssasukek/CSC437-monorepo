// page.css.ts
import { css } from "lit";

export default css`
  .login-background {
    background: url("/styles/background/b2.png") no-repeat center center fixed;
    background-size: cover;
    font-family: var(--font-body);
    color: var(--color-text);
  }

  .login-cont {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
  }

  .login-card {
    backdrop-filter: blur(8px);
    border-radius: 24px;
    padding: 2rem 4rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .login-card h2 {
    font-family: var(--font-display);
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .login-card label {
    display: block;
    text-align: left;
    margin: 1rem 0 0.5rem;
  }

  .login-card input[type="user"],
  .login-card input[type="password"] {
    width: 100%;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  .login-options {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    margin: 1rem 0;
    margin-top: auto;
  }

  .signup-link {
    margin-top: 1rem;
    font-size: 0.9rem;
  }
`;
