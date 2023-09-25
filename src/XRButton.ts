/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type XRButtonOptions = {
	optionalFeatures?: string[] | undefined;
	requiredFeatures?: string[] | undefined;
	onSessionStarted?: (_session: XRSession) => void;
	onSessionEnded?: (_session: XRSession) => void;
	onSupported?: () => void;
	onUnsupported?: () => void;
	onFeaturesUnsupported?: (_reason: string) => void;
	onNotAllowed?: (_exception: DOMException) => void;
	ENTER_XR_TEXT?: string;
	LEAVE_XR_TEXT?: string;
	XR_NOT_SUPPORTED_TEXT?: string;
	XR_NOT_ALLOWED_TEXT?: string;
};

export class ARButton {
	static convertToARButton(
		button: HTMLButtonElement,
		renderer: THREE.WebGLRenderer,
		options: XRButtonOptions = {},
	) {
		function showEnterAR() {
			const sessionInit = {
				requiredFeatures: options.requiredFeatures ?? [],
				optionalFeatures: options.optionalFeatures ?? [],
			};

			let currentSession: XRSession;

			async function onSessionStarted(session: XRSession) {
				session.addEventListener('end', onSessionEnded);
				await renderer.xr.setSession(session);
				button.textContent = options.LEAVE_XR_TEXT ?? 'EXIT AR';
				currentSession = session;
				if (options.onSessionStarted) {
					options.onSessionStarted(currentSession);
				}
			}

			function onSessionEnded() {
				currentSession.removeEventListener('end', onSessionEnded);
				button.textContent = options.ENTER_XR_TEXT ?? 'ENTER AR';
				if (options.onSessionEnded) {
					options.onSessionEnded(currentSession);
				}
				currentSession = null;
			}

			button.textContent = options.ENTER_XR_TEXT ?? 'ENTER AR';

			button.onclick = function () {
				if (!currentSession) {
					navigator.xr
						.requestSession('immersive-ar', sessionInit)
						.then(onSessionStarted)
						.catch((reason) => {
							if (options.onFeaturesUnsupported) {
								options.onFeaturesUnsupported(reason);
							}
						});
				} else {
					currentSession.end();
				}
			};

			if (options.onSupported) {
				options.onSupported();
			}
		}

		function showARNotSupported() {
			button.onclick = null;
			button.classList.add('ar-not-supported');
			button.textContent = options.XR_NOT_SUPPORTED_TEXT ?? 'AR NOT SUPPORTED';
			if (options.onUnsupported) {
				options.onUnsupported();
			}
		}

		function showARNotAllowed(exception: DOMException) {
			button.onclick = null;
			button.classList.add('ar-not-allowed');
			button.textContent = options.XR_NOT_ALLOWED_TEXT ?? 'AR NOT ALLOWED';
			console.warn(
				'Exception when trying to call xr.isSessionSupported',
				exception,
			);
			if (options.onNotAllowed) {
				options.onNotAllowed(exception);
			}
		}

		if ('xr' in navigator) {
			navigator.xr
				.isSessionSupported('immersive-ar')
				.then(function (supported) {
					supported ? showEnterAR() : showARNotSupported();
				})
				.catch(showARNotAllowed);
		} else {
			showARNotSupported();
		}
	}

	static createButton(
		renderer: THREE.WebGLRenderer,
		options: XRButtonOptions = {},
	) {
		const button = document.createElement('button');
		ARButton.convertToARButton(button, renderer, options);
		return button;
	}
}

export class VRButton {
	static convertToVRButton(
		button: HTMLButtonElement,
		renderer: THREE.WebGLRenderer,
		options: XRButtonOptions = {},
	) {
		function showEnterVR() {
			const sessionInit = {
				requiredFeatures: options.requiredFeatures ?? [],
				optionalFeatures: options.optionalFeatures ?? ['local-floor'],
			};
			let currentSession: XRSession;

			async function onSessionStarted(session: XRSession) {
				session.addEventListener('end', onSessionEnded);
				await renderer.xr.setSession(session);
				button.textContent = options.LEAVE_XR_TEXT ?? 'EXIT VR';
				currentSession = session;
				if (options.onSessionStarted) options.onSessionStarted(currentSession);
			}

			function onSessionEnded() {
				currentSession.removeEventListener('end', onSessionEnded);
				button.textContent = options.ENTER_XR_TEXT ?? 'ENTER VR';
				if (options.onSessionEnded) options.onSessionEnded(currentSession);
				currentSession = null;
			}

			button.textContent = options.ENTER_XR_TEXT ?? 'ENTER VR';

			button.onclick = function () {
				if (!currentSession) {
					navigator.xr
						.requestSession('immersive-vr', sessionInit)
						.then(onSessionStarted)
						.catch((reason) => {
							if (options.onFeaturesUnsupported) {
								options.onFeaturesUnsupported(reason);
							}
						});
				} else {
					currentSession.end();
				}

				if (options.onSupported) {
					options.onSupported();
				}
			};
		}

		function showWebXRNotFound() {
			button.onclick = null;
			button.classList.add('vr-not-supported');
			button.textContent = options.XR_NOT_SUPPORTED_TEXT ?? 'VR NOT SUPPORTED';
			if (options.onUnsupported) options.onUnsupported();
		}

		function showVRNotAllowed(exception: DOMException) {
			button.onclick = null;
			button.classList.add('vr-not-allowed');
			button.textContent = options.XR_NOT_ALLOWED_TEXT ?? 'VR NOT ALLOWED';
			console.warn(
				'Exception when trying to call xr.isSessionSupported',
				exception,
			);
			if (options.onNotAllowed) options.onNotAllowed(exception);
		}

		if ('xr' in navigator) {
			navigator.xr
				.isSessionSupported('immersive-vr')
				.then(function (supported) {
					supported ? showEnterVR() : showWebXRNotFound();

					if (supported && VRButton.xrSessionIsGranted) {
						button.click();
					}
				})
				.catch(showVRNotAllowed);
		} else {
			showWebXRNotFound();
		}
	}

	static xrSessionIsGranted = false;

	static registerSessionGrantedListener() {
		if ('xr' in navigator) {
			// WebXRViewer (based on Firefox) has a bug where addEventListener
			// throws a silent exception and aborts execution entirely.
			if (/WebXRViewer\//i.test(navigator.userAgent)) return;

			navigator.xr.addEventListener('sessiongranted', () => {
				VRButton.xrSessionIsGranted = true;
			});
		}
	}

	static createButton(
		renderer: THREE.WebGLRenderer,
		options: XRButtonOptions = {},
	) {
		const button = document.createElement('button');
		VRButton.convertToVRButton(button, renderer, options);
		return button;
	}
}

VRButton.registerSessionGrantedListener();
