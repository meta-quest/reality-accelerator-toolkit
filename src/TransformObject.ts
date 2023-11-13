/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Group, Matrix4, Vector3, WebXRManager } from 'three';

export class TransformObject extends Group {
	protected _xrSpace: XRSpace;

	public needsUpdate = true;

	public constructor(xrSpace: XRSpace) {
		super();
		this._xrSpace = xrSpace;
	}

	get xrSpace() {
		return this._xrSpace;
	}
}

const tempVec3 = new Vector3();

export const updateTransformObject = (
	transformObject: TransformObject,
	xrManager: WebXRManager,
) => {
	const frame = xrManager.getFrame();
	const refSpace = xrManager.getReferenceSpace();
	if (!refSpace) {
		throw 'renderer.xr.getReferenceSpace() returned null';
	}
	const pose = frame.getPose(transformObject.xrSpace, refSpace);

	if (!pose) {
		throw 'pose is not available';
	}
	new Matrix4()
		.fromArray(pose.transform.matrix)
		.decompose(transformObject.position, transformObject.quaternion, tempVec3);
};
