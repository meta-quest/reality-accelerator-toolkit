---
outline: deep
---

# Plane Class

The `Plane` class in the Reality Accelerator Toolkit (RATK) extends the [`TransformObject`](./transform-object.md) class and represents detected physical planes in a WebXR environment.

## Constructor

```ts
constructor(xrPlane: XRPlane)
```

- **xrPlane**: `XRPlane` - Represents the physical plane detected in the XR environment.

## Properties

- `.xrPlane: XRPlane` (read-only): The underlying `XRPlane` object.
- `.orientation: string` (read-only): The orientation of the plane, either 'Horizontal' or 'Vertical'.
- `.lastUpdated: number` (read-only): The timestamp of the last time the plane was updated.
- `.semanticLabel: string | undefined` (read-only): The semantic label of the plane, if available.
- `.planeMesh: Mesh | undefined`: A `Mesh` object representing the plane in the 3D space.
- `.boundingRectangleWidth: number`: The width of the bounding rectangle of the plane.
- `.boundingRectangleHeight: number`: The height of the bounding rectangle of the plane.
- `.needsUpdate: boolean`: Indicates whether the plane's transformation needs an update.
- `.lastUpdatedByRATK: number`: The timestamp of the last update made by RATK.

## Description

The `Plane` class is essential in AR applications for understanding and interacting with the physical environment. It provides details about detected physical planes, including dimensions, orientation, and other characteristics necessary for accurately overlaying virtual content onto the real world. The class also manages the mesh representation of the plane in 3D space, allowing for visual representation and interaction.
