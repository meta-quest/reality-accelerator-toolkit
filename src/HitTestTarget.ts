import { Group, Vector3, WebXRManager } from 'three';

export class HitTestTarget extends Group {
	private _xrHitTestSource: XRHitTestSource;

	public hitTestResultValid: boolean = false;
	public hitTestResults: XRHitTestResult[];

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
	hitTestTarget.hitTestResults = frame.getHitTestResults(
		hitTestTarget.xrHitTestSource,
	);
	hitTestTarget.hitTestResultValid = false;
	if (hitTestTarget.hitTestResults.length > 0) {
		const hitPose = hitTestTarget.hitTestResults[0].getPose(refSpace);
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
	const xrHitTestSource = await xrManager.getSession().requestHitTestSource({
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
				w: 1,
			},
		),
	});
	const hitTestTarget = new HitTestTarget(xrHitTestSource);
	return hitTestTarget;
};