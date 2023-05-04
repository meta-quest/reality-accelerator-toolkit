/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type ARButtonOptions = {
	optionalFeatures?: string[] | undefined;
	requiredFeatures?: string[] | undefined;
	onSessionStarted?: (_session: XRSession) => void;
	onSessionEnded?: (_session: XRSession) => void;
	onSupported?: () => void;
	onUnsupported?: () => void;
	onFeaturesUnsupported?: (_reason: string) => void;
	onNotAllowed?: (_exception: DOMException) => void;
	ENTER_AR_TEXT?: string;
	LEAVE_AR_TEXT?: string;
	AR_NOT_SUPPORTED_TEXT?: string;
	AR_NOT_ALLOWED_TEXT?: string;
};

export class ARButton {
	static convertToARButton(
		button: HTMLButtonElement,
		renderer: THREE.WebGLRenderer,
		options: ARButtonOptions = {},
	) {
		function showStartAR() {
			const sessionInit = {
				requiredFeatures: options.requiredFeatures ?? [],
				optionalFeatures: options.optionalFeatures ?? [],
			};

			let currentSession: XRSession;

			async function onSessionStarted(session: XRSession) {
				session.addEventListener('end', onSessionEnded);
				renderer.xr.setReferenceSpaceType('local');
				await renderer.xr.setSession(session);
				button.textContent = options.LEAVE_AR_TEXT ?? 'EXIT AR';
				currentSession = session;
				if (options.onSessionStarted) {
					options.onSessionStarted(currentSession);
				}
			}

			function onSessionEnded() {
				currentSession.removeEventListener('end', onSessionEnded);
				button.textContent = options.ENTER_AR_TEXT ?? 'ENTER AR';
				if (options.onSessionEnded) {
					options.onSessionEnded(currentSession);
				}
				currentSession = null;
			}

			button.textContent = options.ENTER_AR_TEXT ?? 'ENTER AR';

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
			button.textContent = options.AR_NOT_SUPPORTED_TEXT ?? 'AR NOT SUPPORTED';
			if (options.onUnsupported) {
				options.onUnsupported();
			}
		}

		function showARNotAllowed(exception: DOMException) {
			button.onclick = null;
			button.classList.add('ar-not-allowed');
			button.textContent = options.AR_NOT_ALLOWED_TEXT ?? 'AR NOT ALLOWED';
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
					supported ? showStartAR() : showARNotSupported();
				})
				.catch(showARNotAllowed);
		} else {
			showARNotSupported();
		}
	}

	static createButton(
		renderer: THREE.WebGLRenderer,
		options: ARButtonOptions = {},
	) {
		const button = document.createElement('button');
		ARButton.convertToARButton(button, renderer, options);
		return button;
	}
}
