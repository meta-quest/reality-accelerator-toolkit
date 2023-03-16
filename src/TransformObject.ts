import { Group, Matrix4, Vector3, WebXRManager } from 'three';

export class TransformObject extends Group {
	protected _xrSpace: XRSpace;

	public needsUpdate: boolean = true;

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

	const pose = frame.getPose(transformObject.xrSpace, refSpace);
	new Matrix4()
		.fromArray(pose.transform.matrix)
		.decompose(transformObject.position, transformObject.quaternion, tempVec3);
};
