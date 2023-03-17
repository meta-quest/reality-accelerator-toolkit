/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as THREE from 'three';

import { BUTTONS, GamepadWrapper } from 'gamepad-wrapper';

import { ARButton } from 'three/examples/jsm/webxr/ARButton';
import { MeshBasicMaterial } from 'three';
import { RealityAccelerator } from 'ratk';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

let camera, scene, renderer, controller;
/** @type {RealityAccelerator} */
let ratk;
let lastAnchor;

init();
animate();

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(
		50,
		window.innerWidth / window.innerHeight,
		0.1,
		10,
	);
	camera.position.set(0, 1.6, 3);

	scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

	const light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1, 1, 1).normalize();
	scene.add(light);

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.xr.enabled = true;
	document.body.appendChild(renderer.domElement);

	document.body.appendChild(
		ARButton.createButton(renderer, {
			requiredFeatures: ['anchors', 'plane-detection'],
		}),
	);

	controller = renderer.xr.getController(0);
	controller.addEventListener('connected', function (event) {
		this.gamepadWrapper = new GamepadWrapper(event.data.gamepad);
	});
	controller.addEventListener('disconnected', function () {
		this.remove(this.children[0]);
		this.gamepadWrapper = null;
	});
	scene.add(controller);

	const controllerModelFactory = new XRControllerModelFactory();

	const controllerGrip = renderer.xr.getControllerGrip(0);
	controllerGrip.add(
		controllerModelFactory.createControllerModel(controllerGrip),
	);
	scene.add(controllerGrip);

	window.addEventListener('resize', onWindowResize);

	// RATK code
	ratk = new RealityAccelerator(renderer.xr);
	ratk.onPlaneAdded = (plane) => {
		console.log(plane);
		const mesh = plane.planeMesh;
		mesh.material = new MeshBasicMaterial({
			transparent: true,
			opacity: 0.5,
			color: Math.random() * 0xffffff,
		});
	};
	scene.add(ratk.root);
}

function updateController(controller) {
	if (controller.gamepadWrapper) {
		controller.gamepadWrapper.update();
		if (controller.gamepadWrapper.getButtonClick(BUTTONS.XR_STANDARD.TRIGGER)) {
			// RATK code
			ratk
				.createAnchor(controller.position, controller.quaternion)
				.then((anchor) => {
					const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
					const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
					const cube = new THREE.Mesh(geometry, material);
					anchor.add(cube);
					lastAnchor = anchor;
				});
		}
		if (controller.gamepadWrapper.getButtonClick(BUTTONS.XR_STANDARD.SQUEEZE)) {
			if (lastAnchor) ratk.deleteAnchor(lastAnchor);
		}
	}
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	renderer.setAnimationLoop(render);
}

function render() {
	updateController(controller);

	// RATK code
	ratk.update();

	renderer.render(scene, camera);
}
