---
outline: deep
---

# Anchor Class

The `Anchor` class in the Reality Accelerator Toolkit (RATK) extends the `TransformObject` class, providing functionalities related to XR anchors in WebXR environments.

## Constructor

```ts
constructor(xrAnchor: XRAnchor, uuid?: string)
```

- **xrAnchor**: `XRAnchor` - An instance of `XRAnchor`.
- **uuid**: `string | undefined` (optional) - A unique identifier for the anchor, used for persistence.

## Properties

- `.xrAnchor: XRAnchor` (read-only): The underlying `XRAnchor` object.
- `.isPersistent: boolean` (read-only): Indicates whether the anchor is persistent (has an associated UUID).
- `.persistenceDeletionPending: boolean`: Indicates if the deletion of the anchor's persistence is pending.
- `.anchorID: string | undefined`: The UUID of the anchor, if it is persistent.

## Methods

### makePersistent

```ts
async makePersistent(): Promise<void>
```

Converts the anchor to a persistent anchor, if supported by the browser.

### makeNonPersistent

```ts
async makeNonPersistent(): Promise<void>
```

Marks the anchor for removal from persistence.

## Description

The `Anchor` class is used for creating and managing XR anchors, which are crucial for establishing stable reference points in AR scenarios. It provides capabilities for making anchors persistent and handling their lifecycle within the WebXR framework.
