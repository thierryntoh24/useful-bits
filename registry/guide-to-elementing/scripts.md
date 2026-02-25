## Table of Contents

[Back to home](readme.md)

1. [SplitText (chars/words)](#splittext-charswords)
1. [SplitText (spaces)](#splittext-spaces)
1. [Smooth Scroll (Lenis)](#smooth-scroll-with-lenis)
1. [Sibling Interaction Example (w/ jQuery)](#sibling-interaction-example-w-jquery)

## Overview

**_`Elementor > Custom Code`_**

_Local scripts can be added through the filesystem to `C:\xampp\htdocs\[project-name]\wp-content\uploads\[folder-name]`, and referenced with_

```js
<script src="http://localhost/[project-name]/wp-content/uploads/[directory]/script.js"></script>
```

### SplitText (chars/words)

```js
let splitText = (element) => {
  let words = element.innerText
    .trim()
    .split(" ")
    .map((word) => word.split(""));

  element.innerText = "";

  words.forEach((word) => {
    let _w = document.createElement("div");
    _w.classList.add("word");

    word.forEach(
      (char) => (_w.innerHTML += `<span class="char">${char}</span>`)
    );

    element.appendChild(_w);
  });
};
```

```css
.word {
  margin-right: 0.25em;
}
```

### SplitText (spaces)

```js
let splitText = (element) => {
  let chars = element.innerText.trim().split("");

  element.setHTML("");

  chars.forEach((char) => {
    element.innerHTML += `<span class="char">${
      char === " " ? "\xa0" : char
    }</span>`;
  });
};
```

### Smooth scroll with Lenis

```js
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical", // vertical, horizontal
  gestureOrientation: "vertical", // vertical, horizontal, both
  smoothWheel: true,
  wheelMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

//get scroll value
// lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
//   console.log({ scroll, limit, velocity, direction, progress })
// })

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

### Sibling interaction example (w/ jQuery)

```js
document.querySelectorAll(".info-list-group").forEach((group, g_idx) => {
  group.querySelectorAll(".info-list-item:has(a)").forEach((item, idx) => {
    let link = item.querySelector("a");

    link.addEventListener("mouseenter", () => {
      group.querySelectorAll(".info-list-item").forEach((sibling, id) => {
        if (!sibling.isSameNode(item))
          gsap.to(sibling, { opacity: 0.25, duration: 0.5 });
      });
    });

    link.addEventListener("mouseleave", () =>
      group
        .querySelectorAll(".info-list-item")
        .forEach((sibling) => gsap.to(sibling, { opacity: 1, duration: 0.5 }))
    );
  });
});
```
