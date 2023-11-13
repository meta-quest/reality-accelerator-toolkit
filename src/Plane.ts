/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
	Mesh,
	MeshBasicMaterial,
	Shape,
	ShapeGeometry,
	WebXRManager,
} from 'three';
import { TransformObject, updateTransformObject } from './TransformObject';

export class Plane extends TransformObject {
	private _xrPlane: XRPlane;

	public needsUpdate = true;

	public lastUpdatedByRATK = -Infinity;

	public planeMesh: Mesh;

	public boundingRectangleWidth: number;

	public boundingRectangleHeight: number;

	public constructor(xrPlane: XRPlane) {
		super(xrPlane.planeSpace);
		this._xrPlane = xrPlane;
	}

	get xrPlane() {
		return this._xrPlane;
	}

	get orientation() {
		return this._xrPlane.orientation;
	}

	get lastUpdated() {
		return this._xrPlane.lastChangedTime;
	}

	get semanticLabel() {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return this._xrPlane.semanticLabel;
	}
}

const createGeometryFromPolygon = (polygon: DOMPointReadOnly[]) => {
	const planeShape = new Shape();
	polygon.forEach((point, i) => {
		if (i == 0) {
			planeShape.moveTo(point.x, point.z);
		} else {
			planeShape.lineTo(point.x, point.z);
		}
	});
	const geometry = new ShapeGeometry(planeShape);
	geometry.rotateX(-Math.PI / 2);

	return geometry;
};

const calculateBoundingRectangleDimension = (polygon: DOMPointReadOnly[]) => {
	let minx = Infinity;
	let minz = Infinity;
	let maxx = -Infinity;
	let maxz = -Infinity;

	polygon.forEach((point) => {
		minx = Math.min(minx, point.x);
		minz = Math.min(minz, point.z);
		maxx = Math.max(maxx, point.x);
		maxz = Math.max(maxz, point.z);
	});

	return [maxx - minx, maxz - minz];
};

export const updatePlane = (plane: Plane, xrManager: WebXRManager) => {
	updateTransformObject(plane, xrManager);
	if (plane.xrPlane.lastChangedTime <= plane.lastUpdatedByRATK) return;

	const planeGeometry = createGeometryFromPolygon(plane.xrPlane.polygon);
	if (plane.planeMesh) {
		plane.planeMesh.geometry.dispose();
		plane.planeMesh.geometry = planeGeometry;
	} else {
		plane.planeMesh = new Mesh(planeGeometry, new MeshBasicMaterial());
		plane.add(plane.planeMesh);
	}

	[plane.boundingRectangleWidth, plane.boundingRectangleHeight] =
		calculateBoundingRectangleDimension(plane.xrPlane.polygon);

	plane.lastUpdatedByRATK = plane.xrPlane.lastChangedTime;
};
