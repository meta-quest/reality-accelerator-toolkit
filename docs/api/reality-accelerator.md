---
outline: deep
---

# RealityAccelerator Class

The `RealityAccelerator` class in the Reality Accelerator Toolkit (RATK) manages various XR entities like planes, meshes, anchors, and hit test targets in a WebXR environment.

## Constructor

```ts
constructor(xrManager: WebXRManager)
```

- **xrManager**: `WebXRManager` - Manages interactions with the XR session and environment.

## Properties

- `.root: Group`: A `Group` object serving as the root in the 3D scene.
- `.planes: Set<Plane>`: A set of all detected `Plane` objects.
- `.meshes: Set<RMesh>`: A set of all detected `RMesh` objects.
- `.anchors: Set<Anchor>`: A set of all created `Anchor` objects.
- `.hitTestTargets: Set<HitTestTarget>`: A set of all active `HitTestTarget` objects.
- `.persistentAnchors: Set<Anchor>` (read-only): A set of all persistent `Anchor` objects.

## Event Handlers

- `onPlaneAdded?: (plane: Plane) => void`: Invoked when a new plane is added.
- `onPlaneDeleted?: (plane: Plane) => void`: Invoked when a plane is deleted.
- `onMeshAdded?: (mesh: RMesh) => void`: Invoked when a new mesh is added.
- `onMeshDeleted?: (mesh: RMesh) => void`: Invoked when a mesh is deleted.

## Methods

### update

```ts
update(): void
```

Updates the state of planes, meshes, anchors, and hit test targets.

### createAnchor

```ts
createAnchor(position: Vector3, quaternion: Quaternion, persistent?: boolean): Promise<Anchor>
```

Creates an `Anchor` with a specified position and orientation.

### deleteAnchor

```ts
deleteAnchor(anchor: Anchor): Promise<void>
```

Deletes a specified `Anchor`.

### restorePersistentAnchors

```ts
restorePersistentAnchors(): Promise<void>
```

Restores all persistent anchors from the session.

### createHitTestTargetFromSpace

```ts
createHitTestTargetFromSpace(space: XRSpace, offsetOrigin?: Vector3, offsetDirection?: Vector3): Promise<HitTestTarget>
```

Creates a `HitTestTarget` based on a given `XRSpace`.

### createHitTestTargetFromViewerSpace

```ts
createHitTestTargetFromViewerSpace(offsetOrigin?: Vector3, offsetDirection?: Vector3): Promise<HitTestTarget>
```

Creates a `HitTestTarget` based on the viewer's space.

### createHitTestTargetFromControllerSpace

```ts
createHitTestTargetFromControllerSpace(handedness: XRHandedness, offsetOrigin?: Vector3, offsetDirection?: Vector3): Promise<HitTestTarget>
```

Creates a `HitTestTarget` based on a controller's space.

### deleteHitTestTarget

```ts
deleteHitTestTarget(hitTestTarget: HitTestTarget): void
```

Deletes a specified `HitTestTarget`.

## Description

`RealityAccelerator` is designed to manage XR entities within a WebXR environment, facilitating complex interactions and visualizations in AR and VR applications. It serves as a hub for entity management, enhancing the integration of XR features into immersive experiences.
