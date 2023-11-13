/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Group, Vector3, WebXRManager } from 'three';

export class HitTestTarget extends Group {
	private _xrHitTestSource: XRHitTestSource;

	public hitTestResultValid = false;

	public hitTestResults: XRHitTestResult[] = [];

	constructor(xrHitTestSource: XRHitTestSource) {
		super();
		this._xrHitTestSource = xrHitTestSource;
	}

	get xrHitTestSource() {
		return this._xrHitTestSource;
	}
}

export const updateHitTestTarget = (
	hitTestTarget: HitTestTarget,
	xrManager: WebXRManager,
) => {
	const frame = xrManager.getFrame();
	const refSpace = xrManager.getReferenceSpace();
	if (!refSpace) {
		throw 'renderer.xr.getReferenceSpace() returned null';
	}
	hitTestTarget.hitTestResults = frame.getHitTestResults(
		hitTestTarget.xrHitTestSource,
	);
	hitTestTarget.hitTestResultValid = false;
	if (hitTestTarget.hitTestResults.length > 0) {
		const hitPose = hitTestTarget.hitTestResults[0].getPose(refSpace);
		if (!hitPose) {
			throw 'hitPose is not available';
		}
		hitTestTarget.position.set(
			hitPose.transform.position.x,
			hitPose.transform.position.y,
			hitPose.transform.position.z,
		);
		hitTestTarget.quaternion.set(
			hitPose.transform.orientation.x,
			hitPose.transform.orientation.y,
			hitPose.transform.orientation.z,
			hitPose.transform.orientation.w,
		);
		hitTestTarget.hitTestResultValid = true;
	}
};

export const createHitTestTargetFromSpace = async (
	xrManager: WebXRManager,
	space: XRSpace,
	offsetOrigin: Vector3,
	offsetDirection: Vector3,
) => {
	const session = xrManager.getSession();
	if (!session) {
		throw 'renderer.xr.getSession() returned null';
	}
	if (!session.requestHitTestSource) {
		throw 'session.requestHitTestSource is undefined';
	}
	const xrHitTestSource = await session.requestHitTestSource({
		space: space,
		offsetRay: new XRRay(
			{
				x: offsetOrigin.x,
				y: offsetOrigin.y,
				z: offsetOrigin.z,
				w: 1,
			},
			{
				x: offsetDirection.x,
				y: offsetDirection.y,
				z: offsetDirection.z,
				w: 0,
			},
		),
	});
	if (!xrHitTestSource) {
		throw 'XRHitTestSource request failed';
	}
	const hitTestTarget = new HitTestTarget(xrHitTestSource);
	return hitTestTarget;
};
