---
outline: deep
---

# RMesh Class

The `RMesh` class in the Reality Accelerator Toolkit (RATK) extends the [`TransformObject`](./transform-object.md) class and represents a mesh in a WebXR environment.

## Constructor

```ts
constructor(xrMesh: XRMesh)
```

- **xrMesh**: `XRMesh` - Represents the XR mesh in the environment.

## Properties

- `.xrMesh: XRMesh` (read-only): The underlying `XRMesh` object.
- `.lastUpdated: number` (read-only): The timestamp of the last time the mesh was updated.
- `.semanticLabel: string | undefined` (read-only): The semantic label of the mesh, if available.
- `.meshMesh: Mesh | undefined`: A `Mesh` object representing the XR mesh in the 3D space.
- `.needsUpdate: boolean`: Indicates whether the mesh's transformation needs an update.
- `.lastUpdatedByRATK: number`: The timestamp of the last update made by RATK.

## Description

`RMesh` class is essential for representing complex 3D objects in AR applications. It provides detailed information about meshes detected in the physical environment, such as their shape, size, and position. This class manages the mesh representation in 3D space, enabling accurate and realistic rendering of virtual content overlaid onto the real world.
