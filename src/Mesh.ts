/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
	BufferAttribute,
	BufferGeometry,
	Mesh,
	MeshBasicMaterial,
	WebXRManager,
} from 'three';
import { TransformObject, updateTransformObject } from './TransformObject';

// XRMesh type def

export type XRMeshSet = Set<XRMesh>;

export interface XRMesh {
	meshSpace: XRSpace;
	vertices: Float32Array;
	indices: Float32Array;
	lastChangedTime: number;
	semanticLabel?: string;
}

export class RMesh extends TransformObject {
	private _xrMesh: XRMesh;

	public needsUpdate = true;

	public lastUpdatedByRATK = -Infinity;

	public meshMesh: Mesh;

	public boundingRectangleWidth: number;

	public boundingRectangleHeight: number;

	public constructor(xrMesh: XRMesh) {
		super(xrMesh.meshSpace);
		this._xrMesh = xrMesh;
	}

	get xrMesh() {
		return this._xrMesh;
	}

	get lastUpdated() {
		return this._xrMesh.lastChangedTime;
	}
}

export const updateMesh = (mesh: RMesh, xrManager: WebXRManager) => {
	updateTransformObject(mesh, xrManager);
	if (mesh.xrMesh.lastChangedTime <= mesh.lastUpdatedByRATK) return;

	const geometry = new BufferGeometry();
	geometry.setAttribute(
		'position',
		new BufferAttribute(mesh.xrMesh.vertices, 3),
	);
	geometry.setIndex(new BufferAttribute(mesh.xrMesh.indices, 1));
	if (mesh.meshMesh) {
		mesh.meshMesh.geometry.dispose();
		mesh.meshMesh.geometry = geometry;
	} else {
		mesh.meshMesh = new Mesh(geometry, new MeshBasicMaterial());
		mesh.add(mesh.meshMesh);
	}

	mesh.lastUpdatedByRATK = mesh.xrMesh.lastChangedTime;
};
