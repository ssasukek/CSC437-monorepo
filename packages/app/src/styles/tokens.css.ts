// page.css.ts
import { css } from "lit";

export default css`
  :root {
    /* Backgrounds */
    --color-background-header: var(--color-accent);

    /* Accents */
    --color-accent: rgb(0, 0, 0);
    --color-accent-inverted: rgb(238, 231, 231);

    /* Links */
    --color-link: var(--color-accent);
    --color-link-inverted: var(--color-accent-inverted);

    /* Text */
    --color-text: var(--color-accent);
    --color-text-inverted: var(--color-accent-inverted);

    /* Gradient */
    /* light mode */
    --gradient-page: linear-gradient(
      180deg,
      #f8fafc 0%,
      #dee3e8 50%,
      #b8d5fb 100%
    );
    --background-image1: url("/styles/background/b2.png");
    --card-bg: #e3dada;

    /* dark mode */
    --gradient-hero: linear-gradient(
      135deg,
      #000428 0%,
      #001f54 50%,
      #004e92 100%
    );
    --background-image2: url("/styles/background/b1.png");
    --card-bg2: #ccc;

    /* Fonts Stuff */
    --font-body: "Open Sans", sans-serif;
    --font-display: "Playfair Display", serif;

    --font-size-base: 1rem;
    --font-size-lg: 1.5rem;
    --font-size-xl: 2.5rem;

    /* Spacing */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;
  }

  /* Dark-Mode */
  body.dark-mode {
    --gradient-hero-light: var(--gradient-hero);

    --color-background-page: #032;
    --color-background-card: #111;
    --color-text: #eee;
    --color-link: var(--color-accent-inverted);

    --card-bg: #494444;
  }
`;
