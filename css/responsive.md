# 响应式设计

- 100%
- rem
- flex
- grid layout
- media queries
- bootstrap fluied classes
- fluied typograph
- viewport units(vh, vw)
- calc in css(calc(10px + 2rem), cal(3 * 2rem))

```css
.min-font-size {
    font-size: calc(18px + 3vw);
}

@media(min-width: 600px) {
    .min-font-size {
        font-size: 3vw;
    }
}

.max-font-size {
    font-size: 3vw;
}

@media(min-width: 800px) {
    .max-font-size {
        font-size: 24px;
    }
}

// use a mixin
.liner-intepolation {
    // 400px -> 16px
    // 800px -> 24px
    // 600px -> 20px
    font-size: calc(16px + (24 - 16) * (100vw - 400px) / (800 - 400));
}
```

- landscape/portrait
- modular scales(type-scale.com)
- responsive svg
- art directed responsive svg
- flex grow:9999
- custom properties, they are dynamic

```css
font-size:calc(3vmin + 2em);
```