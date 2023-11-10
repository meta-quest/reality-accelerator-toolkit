/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as THREE from 'three';

import { BUTTONS, GamepadWrapper } from 'gamepad-wrapper';

import { ARButton } from 'ratk';
import { MeshBasicMaterial } from 'three';
import { RealityAccelerator } from 'ratk';
import { Text } from 'troika-three-text';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

let camera, scene, renderer, controller;
/** @type {RealityAccelerator} */
let ratk;
let recoveredPersistentAnchors = false;

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

	const arButton = document.getElementById('ar-button');
	const webLaunchButton = document.getElementById('web-launch-button');
	webLaunchButton.onclick = () => {
		window.open(
			'https://www.oculus.com/open_url/?url=' +
				encodeURIComponent(window.location.href),
		);
	};

	ARButton.convertToARButton(arButton, renderer, {
		requiredFeatures: [
			'anchors',
			'plane-detection',
			'hit-test',
			'mesh-detection',
			'local-floor',
		],
		onUnsupported: () => {
			arButton.style.display = 'none';
			webLaunchButton.style.display = 'block';
		},
	});

	controller = renderer.xr.getController(0);
	controller.addEventListener('connected', async function (event) {
		this.gamepadWrapper = new GamepadWrapper(event.data.gamepad);
		this.hitTestTarget = await ratk.createHitTestTargetFromControllerSpace(
			event.data.handedness,
		);
	});
	controller.addEventListener('disconnected', function () {
		this.remove(this.children[0]);
		this.gamepadWrapper = null;
		ratk.deleteHitTestTarget(this.hitTestTarget)
		this.hitTestTarget = null;
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
		const mesh = plane.planeMesh;
		mesh.material = new MeshBasicMaterial({
			wireframe: true,
			color: Math.random() * 0xffffff,
		});
	};
	ratk.onMeshAdded = (mesh) => {
		const meshMesh = mesh.meshMesh;
		meshMesh.material = new MeshBasicMaterial({
			wireframe: true,
			color: Math.random() * 0xffffff,
		});
		meshMesh.geometry.computeBoundingBox();
		console.log(meshMesh.geometry.boundingBox);
		const semanticLabel = new Text();
		meshMesh.add(semanticLabel);
		semanticLabel.text = mesh.semanticLabel;
		semanticLabel.anchorX = 'center';
		semanticLabel.anchorY = 'bottom';
		semanticLabel.fontSize = 0.1;
		semanticLabel.color = 0x000000;
		semanticLabel.sync();
		semanticLabel.position.y = meshMesh.geometry.boundingBox.max.y;
		mesh.userData.semanticLabelMesh = semanticLabel;
	};
	scene.add(ratk.root);
}

function updateController(controller) {
	if (controller.gamepadWrapper && controller.hitTestTarget) {
		controller.gamepadWrapper.update();
		if (controller.gamepadWrapper.getButtonClick(BUTTONS.XR_STANDARD.TRIGGER)) {
			// RATK code
			ratk
				.createAnchor(
					controller.hitTestTarget.position,
					controller.hitTestTarget.quaternion,
					true,
				)
				.then((anchor) => {
					const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
					const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
					const cube = new THREE.Mesh(geometry, material);
					anchor.add(cube);
					console.log(anchor.isPersistent, anchor.anchorID);
				});
		}
		if (controller.gamepadWrapper.getButtonClick(BUTTONS.XR_STANDARD.SQUEEZE)) {
			ratk.anchors.forEach((anchor) => {
				console.log(anchor.anchorID);
				ratk.deleteAnchor(anchor);
			});
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
	if (renderer.xr.isPresenting && !recoveredPersistentAnchors) {
		setTimeout(() => {
			ratk.restorePersistentAnchors().then(() => {
				ratk.anchors.forEach((anchor) => {
					console.log(anchor);
					const geometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
					const material = new THREE.MeshBasicMaterial({ color: 0x0ffff0 });
					const cube = new THREE.Mesh(geometry, material);
					anchor.add(cube);
				});
			});
		}, 1000);

		recoveredPersistentAnchors = true;
	}

	if (renderer.xr.isPresenting) {
		recoveredPersistentAnchors = false;
	}

	updateController(controller);

	// RATK code
	ratk.update();
	ratk.meshes.forEach((mesh) => {
		const semanticLabel = mesh.userData.semanticLabelMesh;
		semanticLabel.lookAt(camera.position);
	});

	renderer.render(scene, camera);
}
