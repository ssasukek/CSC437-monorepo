import { css } from "lit";

export default css`
  .profile {
    max-width: 600px;
    margin: 80px auto;
    padding: 2rem;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 12px;
    color: #ffffff;
    font-family: "Open Sans", sans-serif;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  }

  .profile h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: center;
    font-family: "Playfair Display", serif;
  }

  .profile p {
    font-size: 1rem;
    margin: 0.5rem 0;
  }

  .profile .edit-btn {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.5rem 1rem;
    background-color: #0077cc;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .profile .edit-btn:hover {
    background-color: #005fa3;
  }

  main {
    display: flex;
    justify-content: center;
    padding-top: 10rem;
  }

  mu-form {
    display: flex;
    width: 100%;
    max-width: 450px;
    margin: 80px auto;
    padding: 2rem;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 12px;
    color: #ffffff;
    font-family: "Open Sans", sans-serif;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  }

  mu-form label {
    display: block;
    margin-bottom: 1rem;
    font-weight: bold;
  }

  mu-form input,
  mu-form textarea {
    padding: 0.5rem;
    margin-top: 0.5rem;
    border-radius: 3px;
    font-family: inherit;
    font-size: 1rem;
    border: none;
    width: 100%;
  }
`;
