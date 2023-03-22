# Reality Accelerator Toolkit

Reality Accelerator Toolkit is a WebXR utilities library designed to simplify the integration of mixed reality features in WebXR applications. It is currently compatible with the [three.js]() 3D library and aims to bridge the gap between low-level WebXR APIs and higher-level APIs provided by three.js. The library is built with the intent to be extensible and compatible with other 3D libraries in the future. It is designed to manage detected planes, anchors, and real-world hit test targets, and to automatically translate them to Object3D instances in the three.js scene, making it easier for developers to access and utilize them.

## Features

- 🚀 Seamless integration with three.js
- 🌐 Automatic tracking and updating of detected planes and anchors
- 🎯 Real-world hit test target translation to Object3D instances in the three.js scene
- 🛠️ Extensible design for future compatibility with other 3D libraries

## Getting Started

### Prerequisites

three.js (latest version recommended)

### Installation

Install the package via NPM:

```bash
$ npm install ratk
```

### Usage

```js
// Import the library
import { RealityAccelerator } from 'ratk';

// Create a new Reality Accelerator instance from three.js WebXRManager
const ratk = new RealityAccelerator(renderer.xr);

// Add all tracked plane and anchor objects to three.js scene
scene.add(ratk.root);

// Update the Reality Accelerator in your render loop
render() {
  ratk.update();
}
```

## Documentation

### API Reference

API documentation can be found [here](https://meta-quest.github.io/reality-accelerator-toolkit).

### Example

An example application utilizing this library can be found [here](https://meta-quest.github.io/reality-accelerator-toolkit/example). Its source code is located in the [example](./example/) directory.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to the project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
