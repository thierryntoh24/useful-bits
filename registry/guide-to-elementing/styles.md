## Table of Contents

[Back to home](readme.md)

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
  - [hide scrollbars](#hide-scrollbars)
  - [disable cursor](#disable-cursor)
  - [change highlight color](#change-highlight-color)
  - [animated mesh](#animated-mesh)
  - [rotate svg](#rotate-svg)

## Overview

**_`Elementor Editor > Site Settings > Custom Styles`_**

### hide scrollbars

```css
/* HIDE SCROLLBARS*/

/* width */
::-webkit-scrollbar {
  width: 0px;
}
/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: transparent;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: transparent;
}

body {
  -webkit-font-smoothing: antialiased;
}

body {
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
}
:root {
  scrollbar-width: none !important;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 0px;
  display: none !important;
}

html,
body {
  -ms-overflow-style: none; /* IE and Edge */
  overflow: -moz-scrollbars-none; /* Firefox */
  scrollbar-width: none; /* Firefox */
}
```

### disable cursor

```css
/* DISABLE CURSOR*/

html * {
  cursor: none !important;
}
```

### change highlight color

```css
/* change highlight color */

::-moz-selection {
  background-color: #ede6e0 !important;
  color: #0f0f0f !important;
}
::selection {
  background-color: #ede6e0 !important;
  color: #0f0f0f !important;
}
```

### animated mesh

```css
selector {
  /* add gradient colors */
  animation: gradient 20s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradient {
  0% {
    background-position: 0% 20%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 50% 70%;
  }
  100% {
    background-position: 0% 20%;
  }
}
```

### rotate svg

```css
selector svg {
  animation: rotate 20s linear infinite;
}

@-webkit-keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```
