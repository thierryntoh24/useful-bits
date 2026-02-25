## Table of Contents

[Back to home](readme.md)

1. [Custom Cursor Example](#custom-cursor-example)
1. [Underlines](#underlines)
1. [Color Toggle](#color-toggle)

### custom cursor example

```html
<div class="cursor">
  <span class="cursor-text">
    <span>loading...</span>
  </span>
</div>
```

```css
.cursor {
  position: absolute;
  height: 8rem;
  width: 8rem;
  border: 1px solid white;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: white;
  pointer-events: none;
}
```

```js
let cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX - visualViewport.width / 2,
    y: e.clientY - visualViewport.height / 2,
    duration: 0.5,
    ease: Linear,
  });
});

document.addEventListener("mouseleave", () =>
  gsap.to(cursor, { opacity: 0, duration: 0.5 })
);
document.addEventListener("mouseenter", () =>
  gsap.to(cursor, { opacity: 1, duration: 0.5 })
);
```

### underlines

```css
.has-underline a {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.has-underline ._underline {
  position: absolute;
  bottom: 0.02em;
  right: -1px;
  height: 1px;
  width: 0%;
  background-color: var(--e-global-color-secondary);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(1, 0, 0.29, 1);
}

.has-underline:hover ._underline {
  left: -1px;
  right: auto;
  width: calc(100% + 1px);
}
```

```js
let underlines = document.querySelectorAll(".has-underline a");

underlines.forEach((item, idx) => {
  let _txt = item.innerText,
    _underline = document.createElement("span"),
    _text = document.createElement("span");

  _underline.classList.add("_underline");
  _text.innerText = _txt;

  item.setHTML("");
  item.appendChild(_text);
  item.appendChild(_underline);
});
```

### COLOR TOGGLE

```html
<div class="color-circle">
  <svg class="color-dot current" viewBox="0 0 12 12">
    <circle fill="#000" cx="6" cy="6" r="6"></circle>
  </svg>
  <svg class="color-dot next" viewBox="0 0 12 12">
    <circle fill="#41443e" cx="6" cy="6" r="6"></circle>
  </svg>
</div>
```

```css
selector {
  position: relative;
  height: 0.75rem;
  width: 0.75rem;
}

selector svg.color-dot {
  position: absolute;
  pointer-events: none;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  height: 100%;
  width: 100%;
  z-index: 0;
}
```

```js
let toggle = document.querySelector(".toggle-menu-color"),
  currentDot = toggle.querySelector(".current"),
  nextDot = toggle.querySelector(".next"),
  colors = ["#000", "#41443e", "#88837c", "#646461"],
  nextColor = 1,
  toggling = false;

gsap.set([currentDot.firstElementChild], { fill: colors[0] });
gsap.set([nextDot.firstElementChild], { fill: colors[nextColor] });

toggle.addEventListener("click", () => {
  if (toggling) return;

  toggling = true;

  gsap
    .timeline({
      defaults: { duration: 0.5, ease: "power2.in" },
      onComplete: () => {
        toggling = false;
        nextColor = nextColor == 3 ? 0 : nextColor + 1;
      },
    })
    .set([currentDot.firstElementChild], { fill: colors[nextColor] })
    .set([nextDot.firstElementChild], {
      fill: colors[nextColor + 1] || colors[0],
    })
    .to(currentDot, { scale: 250 })
    .fromTo(nextDot, { scale: 0 }, { scale: 1 }, "<")
    .set(".pane", { backgroundColor: colors[nextColor] })
    .set(currentDot, { delay: 0.25, scale: 1 });
});
```
