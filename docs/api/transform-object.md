---
outline: deep
---

# TransformObject Class

The `TransformObject` class in the Reality Accelerator Toolkit (RATK) is an extension of the `Group` class from the `three.js` library, designed to represent objects with transforms in a WebXR environment.

## Constructor

```ts
constructor(xrSpace: XRSpace)
```

- **xrSpace**: `XRSpace` - The reference space for the transformation.

## Properties

- `.xrSpace: XRSpace` (read-only): The `XRSpace` associated with the transform object.
- `.needsUpdate: boolean`: Indicates whether the object's transformation needs an update.

## Description

`TransformObject` serves as a foundational class for objects with spatial relationships in a WebXR scene. It holds a reference to `XRSpace`, enabling derived classes to interact with and manipulate objects within the WebXR framework.
