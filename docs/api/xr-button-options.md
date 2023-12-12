---
outline: deep
---

# XRButtonOptions Type

`XRButtonOptions` is a type representing configuration options for XR buttons, specifically for AR and VR sessions.

## Fields

- `optionalFeatures?: string[]`: Optional features for the XR session.
- `requiredFeatures?: string[]`: Required features for the XR session.
- `onSessionStarted?: (_session: XRSession) => void`: Callback for when an XR session starts.
- `onSessionEnded?: (_session: XRSession) => void`: Callback for when an XR session ends.
- `onSupported?: () => void`: Callback for when XR is supported.
- `onUnsupported?: () => void`: Callback for when XR is not supported.
- `onFeaturesUnsupported?: (_reason: string) => void`: Callback for when required features are unsupported.
- `onNotAllowed?: (_exception: DOMException) => void`: Callback for when XR access is not allowed.
- `ENTER_XR_TEXT?: string`: Text to display for entering XR mode.
- `LEAVE_XR_TEXT?: string`: Text to display for leaving XR mode.
- `XR_NOT_SUPPORTED_TEXT?: string`: Text to display when XR is not supported.
- `XR_NOT_ALLOWED_TEXT?: string`: Text to display when XR access is not allowed.
