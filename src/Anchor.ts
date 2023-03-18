/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Quaternion, Vector3, WebXRManager } from 'three';

import { TransformObject } from './TransformObject';

export class Anchor extends TransformObject {
	private _xrAnchor: XRAnchor;

	public persistenceDeletionPending = false;

	public anchorID: string;

	constructor(xrAnchor: XRAnchor, uuid: string = null) {
		super(xrAnchor.anchorSpace);
		this._xrAnchor = xrAnchor;
		this.anchorID = uuid;
	}

	get xrAnchor() {
		return this._xrAnchor;
	}

	get isPersistent() {
		return this.anchorID != null;
	}

	public async makePersistent() {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if (!this._xrAnchor.requestPersistentHandle) {
			throw new DOMException(
				'feature not supported by browser',
				'NotSupportedError',
			);
		} else if (this.isPersistent) {
			throw new DOMException(
				'anchor is already persistent',
				'InvalidStateError',
			);
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.anchorID = await this._xrAnchor.requestPersistentHandle();
	}

	public async makeNonPersistent() {
		this.persistenceDeletionPending = true;
	}
}

export const createAnchorFromTransform = async (
	xrManager: WebXRManager,
	position: Vector3,
	quaternion: Quaternion,
) => {
	const frame = xrManager.getFrame();
	const refSpace = xrManager.getReferenceSpace();
	const anchorPose = new XRRigidTransform(
		{
			x: position.x,
			y: position.y,
			z: position.z,
		},
		{
			x: quaternion.x,
			y: quaternion.y,
			z: quaternion.z,
			w: quaternion.w,
		},
	);

	const xrAnchor = await frame.createAnchor(anchorPose, refSpace);
	const anchor = new Anchor(xrAnchor);
	return anchor;
};

export const restoreAnchorFromUUID = async (
	xrManager: WebXRManager,
	uuid: string,
) => {
	const session = xrManager.getSession();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (!session.restorePersistentAnchor) {
		throw new DOMException(
			'feature not supported by browser',
			'NotSupportedError',
		);
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const xrAnchor = await session.restorePersistentAnchor(uuid);
	const anchor = new Anchor(xrAnchor, uuid);
	return anchor;
};

export const deleteAnchorPersistence = async (
	anchor: Anchor,
	xrManager: WebXRManager,
) => {
	if (anchor.isPersistent) {
		const session = xrManager.getSession();

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if (!session.deletePersistentAnchor) {
			throw new DOMException(
				'feature not supported by browser',
				'NotSupportedError',
			);
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		await session.deletePersistentAnchor(anchor.anchorID);
		anchor.anchorID = null;
	}
};
