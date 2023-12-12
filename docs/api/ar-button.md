---
outline: deep
---

# ARButton Class

`ARButton` is a utility class for creating and managing buttons to enter and exit AR (Augmented Reality) sessions.

## Static Methods

### convertToARButton

```ts
static convertToARButton(
    button: HTMLButtonElement,
    renderer: THREE.WebGLRenderer,
    options: XRButtonOptions = {}
): void
```

Converts a standard HTML button into a button that manages AR sessions, using [XRButtonOptions](./xr-button-options.md) for configuration.

### createButton

```ts
static createButton(
    renderer: THREE.WebGLRenderer,
    options: XRButtonOptions = {}
): HTMLButtonElement
```

Creates an HTML button that manages AR sessions, using [XRButtonOptions](./xr-button-options.md) for configuration.
