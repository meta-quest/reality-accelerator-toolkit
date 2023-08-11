/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
	Anchor,
	createAnchorFromTransform,
	deleteAnchorPersistence,
	restoreAnchorFromUUID,
} from './Anchor';
import { Group, Quaternion, Vector3, WebXRManager } from 'three';
import {
	HitTestTarget,
	createHitTestTargetFromSpace,
	updateHitTestTarget,
} from './HitTestTarget';
import { Plane, updatePlane } from './Plane';
import { RMesh, XRMesh, XRMeshSet, updateMesh } from './Mesh';

import { updateTransformObject } from './TransformObject';

export class RealityAccelerator {
	private _xrManager: WebXRManager;

	private _planes: Set<Plane>;

	private _meshes: Set<RMesh>;

	private _anchors: Set<Anchor>;

	private _hitTestTargets: Set<HitTestTarget>;

	private _root: Group;

	public constructor(xrManager: WebXRManager) {
		this._xrManager = xrManager;
		this._planes = new Set();
		this._meshes = new Set();
		this._anchors = new Set();
		this._hitTestTargets = new Set();
		this._root = new Group();
	}

	get root() {
		return this._root;
	}

	get planes() {
		return this._planes;
	}

	get meshes() {
		return this._meshes;
	}

	get anchors() {
		return this._anchors;
	}

	get hitTestTargets() {
		return this._hitTestTargets;
	}

	get persistentAnchors() {
		return new Set(
			Array.from(this._anchors).filter((anchor) => anchor.isPersistent),
		);
	}

	public onPlaneAdded: (_arg: Plane) => void;

	public onPlaneDeleted: (_arg: Plane) => void;

	public onMeshAdded: (_arg: RMesh) => void;

	public onMeshDeleted: (_arg: RMesh) => void;

	public update() {
		if (!this._xrManager.isPresenting) return;
		const frame = this._xrManager.getFrame();

		this._checkPlaneDiff(frame);

		this.planes.forEach((plane) => {
			updatePlane(plane, this._xrManager);
		});

		this._checkMeshDiff(frame);

		this.meshes.forEach((mesh) => {
			updateMesh(mesh, this._xrManager);
		});

		this.anchors.forEach((anchor) => {
			updateTransformObject(anchor, this._xrManager);
		});

		this._hitTestTargets.forEach((hitTestTarget) => {
			updateHitTestTarget(hitTestTarget, this._xrManager);
		});
	}

	private _checkPlaneDiff(frame: XRFrame) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const detectedPlanes = frame.detectedPlanes as XRPlaneSet;

		const newXrPlanes: XRPlane[] = [];
		detectedPlanes.forEach((xrPlane) => {
			let match = false;
			this._planes.forEach((plane) => {
				if (plane.xrPlane === xrPlane) match = true;
			});
			if (!match) newXrPlanes.push(xrPlane);
		});

		const deletedPlanes: Plane[] = [];
		this._planes.forEach((plane) => {
			if (!detectedPlanes.has(plane.xrPlane)) {
				deletedPlanes.push(plane);
			}
		});

		newXrPlanes.forEach((xrPlane) => {
			const plane = new Plane(xrPlane);
			updatePlane(plane, this._xrManager);
			this._root.add(plane);
			if (this.onPlaneAdded) {
				this.onPlaneAdded(plane);
			}
			this._planes.add(plane);
		});

		deletedPlanes.forEach((plane) => {
			if (this.onPlaneDeleted) {
				this.onPlaneDeleted(plane);
			}
			this._root.remove(plane);
			this._planes.delete(plane);
		});
	}

	private _checkMeshDiff(frame: XRFrame) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const detectedMeshes = frame.detectedMeshes as XRMeshSet;

		const newXrMeshes: XRMesh[] = [];
		detectedMeshes.forEach((xrMesh) => {
			let match = false;
			this._meshes.forEach((mesh) => {
				if (mesh.xrMesh === xrMesh) match = true;
			});
			if (!match) newXrMeshes.push(xrMesh);
		});

		const deletedMeshes: RMesh[] = [];
		this._meshes.forEach((mesh) => {
			if (!detectedMeshes.has(mesh.xrMesh)) {
				deletedMeshes.push(mesh);
			}
		});

		newXrMeshes.forEach((xrMesh) => {
			const mesh = new RMesh(xrMesh);
			updateMesh(mesh, this._xrManager);
			this._root.add(mesh);
			if (this.onMeshAdded) {
				this.onMeshAdded(mesh);
			}
			this._meshes.add(mesh);
		});

		deletedMeshes.forEach((mesh) => {
			if (this.onMeshDeleted) {
				this.onMeshDeleted(mesh);
			}
			this._root.remove(mesh);
			this._meshes.delete(mesh);
		});
	}

	public async createAnchor(
		position: Vector3,
		quaternion: Quaternion,
		persistent = false,
	) {
		const anchor = await createAnchorFromTransform(
			this._xrManager,
			position,
			quaternion,
		);
		this._root.add(anchor);
		this._anchors.add(anchor);
		if (persistent) {
			await anchor.makePersistent();
		}
		return anchor;
	}

	public async deleteAnchor(anchor: Anchor) {
		if (anchor.isPersistent) {
			await deleteAnchorPersistence(anchor, this._xrManager);
		}
		this._anchors.delete(anchor);
		this._root.remove(anchor);
		anchor.xrAnchor.delete();
	}

	public async restorePersistentAnchors() {
		const session = this._xrManager.getSession();
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const persistentAnchors = session.persistentAnchors;
		if (!persistentAnchors) {
			throw new DOMException(
				'feature not supported by browser',
				'NotSupportedError',
			);
		}

		for (const anchorId of persistentAnchors as Array<string>) {
			const anchor = await restoreAnchorFromUUID(this._xrManager, anchorId);
			this._root.add(anchor);
			this._anchors.add(anchor);
		}
	}

	public async createHitTestTargetFromSpace(
		space: XRSpace,
		offsetOrigin: Vector3 = new Vector3(0, 0, 0),
		offsetDirection: Vector3 = new Vector3(0, 0, -1),
	) {
		const hitTestTarget = await createHitTestTargetFromSpace(
			this._xrManager,
			space,
			offsetOrigin,
			offsetDirection,
		);
		this._root.add(hitTestTarget);
		this._hitTestTargets.add(hitTestTarget);
		return hitTestTarget;
	}

	public async createHitTestTargetFromViewerSpace(
		offsetOrigin: Vector3 = new Vector3(0, 0, 0),
		offsetDirection: Vector3 = new Vector3(0, 0, -1),
	) {
		const viewerSpace = await this._xrManager
			.getSession()
			.requestReferenceSpace('viewer');
		return await this.createHitTestTargetFromSpace(
			viewerSpace,
			offsetOrigin,
			offsetDirection,
		);
	}

	public async createHitTestTargetFromControllerSpace(
		handedness: XRHandedness,
		offsetOrigin: Vector3 = new Vector3(0, 0, 0),
		offsetDirection: Vector3 = new Vector3(0, 0, -1),
	) {
		let xrInputSource: XRInputSource = null;
		this._xrManager.getSession().inputSources.forEach((source) => {
			if (source.handedness === handedness) {
				xrInputSource = source;
			}
		});
		if (!xrInputSource)
			throw new DOMException(
				'requested XRInputSource cannot be found',
				'NotFoundError',
			);
		return await this.createHitTestTargetFromSpace(
			xrInputSource.targetRaySpace,
			offsetOrigin,
			offsetDirection,
		);
	}

	public deleteHitTestTarget(hitTestTarget: HitTestTarget) {
		hitTestTarget.xrHitTestSource.cancel();
		this._root.remove(hitTestTarget);
		this._hitTestTargets.delete(hitTestTarget);
	}
}
