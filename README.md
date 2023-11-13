# Reality Accelerator Toolkit

[![npm version](https://badge.fury.io/js/ratk.svg)](https://badge.fury.io/js/ratk)
[![language](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
[![npm download](https://badgen.net/npm/dw/ratk)](https://www.npmjs.com/package/ratk)
[![license](https://badgen.net/github/license/meta-quest/reality-accelerator-toolkit)](/LICENSE.md)

The Reality Accelerator Toolkit is a comprehensive WebXR utilities library that simplifies the integration of mixed reality features in WebXR applications. Compatible with the [three.js](https://threejs.org/) 3D library, it bridges the gap between the low-level WebXR APIs and the higher-level APIs offered by three.js. Designed for extensibility, it enables the management of detected planes, meshes, anchors, and real-world hit test targets, translating them seamlessly to Object3D instances in the three.js scene.

## Features

- 🚀 Seamless integration with three.js for enhanced 3D application development.
- 🌐 Automatic detection and update of planes, meshes and anchors in the scene.
- 🎯 Translation of real-world hit test targets to Object3D instances in three.js.

## Getting Started

### Prerequisites

- **Peer dependency**: three.js (latest version recommended): [three.js Documentation](https://threejs.org/docs/)

### Installation

To install the package via NPM, run:

```bash
$ npm install ratk
```

## Usage

Each section below details how to use different features of the toolkit.

### RATK Setup

1. **Setting Up AR Button**: Request a WebXR session with specified features.

```js
import { ARButton } from 'ratk';
const renderer = /* Three.js WebGLRenderer */;
const arButton = document.getElementById('ar-button');

ARButton.convertToARButton(arButton, renderer, {
  sessionInit: {
    requiredFeatures: ['hit-test', 'plane-detection', 'mesh-detection', 'anchors'],
    optionalFeatures: [],
  },
});
```

2. **Initializing RATK**: Integrate RATK's root object with your scene. Update it in the render loop.

```js
// Import the library
import { RealityAccelerator } from 'ratk';
const ratk = new RealityAccelerator(renderer.xr);
const scene = /* Three.js Scene object */;
scene.add(ratk.root);

function render() {
	ratk.update();
}
```

### Anchors

- **Creating Anchors**: Define position and orientation, then attach objects.

  ```js
  const ratk = /* RealityAccelerator instance */;
  const anchorPosition = new Vector3(1, 2, 3);
  const anchorQuaternion = new Quaternion(0, 0, 0, 1);

  ratk.createAnchor(anchorPosition, anchorQuaternion, isPersistent)
    .then((anchor /* RATK Anchor object extends Object3D */) => {
      // Attach a new THREE.Mesh to the anchor
      anchor.add(new THREE.Mesh(geometry, material));
    });
  ```

- **Recovering Anchors**: Access persistent anchors from previous sessions.

  ```js
  ratk.restorePersistentAnchors().then(() => {
  	ratk.anchors.forEach((anchor) => {
  		// Process each recovered anchor
  		anchor.add(new THREE.Mesh(geometry, material));
  	});
  });
  ```

### Planes

- **Processing Planes**: Define a hook to handle new planes.

  ```js
  ratk.onPlaneAdded = (plane /* extends Object3D */) => {
  	if (plane.semanticLabel === 'wall art') {
  		const mesh = plane.planeMesh; // Three.js Plane Mesh
  		mesh.material = new MeshBasicMaterial(/_ parameters _/);
  		// Additional plane processing
  	}
  };
  ```

- Alternatively, access planes directly from the RATK instance:

  ```js
  ratk.planes.forEach((plane) => {
  	// Process each plane
  });
  ```

### Meshes

- **Processing Meshes**: Define a hook to handle new meshes.

  ```js
  ratk.onMeshAdded = (rmesh /* extends Object3D */) => {
    const meshMesh = rmesh.meshMesh; /* reconstructed Three.js Mesh */
    meshMesh.material = new MeshBasicMaterial(...);
    meshMesh.geometry.computeBoundingBox();

    // put a text label on top of the mesh
    const semanticLabel = new Text();
    meshMesh.add(semanticLabel);
    semanticLabel.text = mesh.semanticLabel;
    semanticLabel.sync();
    semanticLabel.position.y = meshMesh.geometry.boundingBox.max.y;
  };
  ```

- Alternatively, access meshes directly from the RATK instance:

  ```js
  ratk.meshes.forEach((rmesh) => {
  	// Process each mesh
  });
  ```

### Hit Testing

- **Controller Hit-Testing**: Create HitTestTarget from controller with offset transform

  ```js
  const ratk = /* RealityAccelerator instance */;
  const offsetPosition = new Vector3(0, 0, 0);
  const offsetQuaternion = new Quaternion(0, 0, 0, 1);

  ratk
    .createHitTestTargetFromControllerSpace(
      handedness,
      offsetPosition,
      offsetQuaternion,
    )
    .then((hitTestTarget /* extends Object3D */) => {
      hitTestTarget.add(
        new Mesh(...),
      );
    });
  ```

- Alternatively, conduct hit-testing from viewer space:

  ```js
  ratk.createHitTestTargetFromViewerSpace(
    offsetPosition,
    offsetQuaternion,
  ).then(...);
  ```

## Documentation

- **API Reference**: [RATK API Documentation](https://meta-quest.github.io/reality-accelerator-toolkit).
- **Example Application**: [Example WebXR Application](https://meta-quest.github.io/reality-accelerator-toolkit/example) ([Source Code](./example/)).

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to the project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
