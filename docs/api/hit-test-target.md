---
outline: deep
---

# HitTestTarget Class

The `HitTestTarget` class in the Reality Accelerator Toolkit (RATK) extends the `Group` class from the `three.js` library and is used for performing hit tests in a WebXR environment.

## Constructor

```ts
constructor(xrHitTestSource: XRHitTestSource)
```

- **xrHitTestSource**: `XRHitTestSource` - The source for performing hit tests in the XR environment.

## Properties

- `.xrHitTestSource: XRHitTestSource` (read-only): The underlying `XRHitTestSource` object used for hit testing.
- `.hitTestResultValid: boolean`: Indicates whether the latest hit test result is valid.
- `.hitTestResults: XRHitTestResult[]`: An array of `XRHitTestResult` objects representing the results of the latest hit test.

## Description

`HitTestTarget` class is crucial for spatial interaction in AR and VR applications. It allows for detecting the intersection of virtual objects with the real world, enabling interactions like placing virtual objects on physical surfaces or interacting with them in 3D space. This class manages the process of hit testing, storing the results, and updating the target's position and orientation based on the hit test outcomes.
