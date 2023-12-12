---
outline: deep
---

# VRButton Class

`VRButton` is a utility class for creating and managing buttons to enter and exit VR (Virtual Reality) sessions.

## Static Methods

### convertToVRButton

```ts
static convertToVRButton(
    button: HTMLButtonElement,
    renderer: THREE.WebGLRenderer,
    options: XRButtonOptions = {}
): void
```

Converts a standard HTML button into a button that manages VR sessions, using [XRButtonOptions](./xr-button-options.md) for configuration.

### createButton

```ts
static createButton(
    renderer: THREE.WebGLRenderer,
    options: XRButtonOptions = {}
): HTMLButtonElement
```

Creates an HTML button that manages VR sessions, using [XRButtonOptions](./xr-button-options.md) for configuration.

### registerSessionGrantedListener

```ts
static registerSessionGrantedListener(): void
```

Registers a listener to set a flag when an XR session is granted.
