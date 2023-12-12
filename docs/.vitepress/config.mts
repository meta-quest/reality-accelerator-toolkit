import { defineConfig } from 'vitepress';

export default defineConfig({
	title: 'Reality Accelerator Toolkit',
	description:
		'Comprehensive WebXR utilities library for mixed reality features in WebXR applications',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'API Reference', link: '/api-reference' },
			{
				text: 'Legal',
				items: [
					{
						text: 'MIT License',
						link: 'https://github.com/meta-quest/reality-accelerator-toolkit/blob/main/LICENSE.md',
					},
					{
						text: 'Term of Use',
						link: 'https://opensource.fb.com/legal/terms',
					},
					{
						text: 'Privacy Policy',
						link: 'https://opensource.fb.com/legal/privacy',
					},
				],
			},
		],

		sidebar: [
			{
				text: 'Getting Started',
				link: '/getting-started',
			},
			{
				text: 'API Reference',
				items: [
					{
						text: 'RealityAccelerator Class',
						link: '/api/reality-accelerator',
					},
					{ text: 'TransformObject Class', link: '/api/transform-object' },
					{ text: 'Anchor Class', link: '/api/anchor' },
					{ text: 'Plane Class', link: '/api/plane' },
					{ text: 'RMesh Class', link: '/api/rmesh' },
					{ text: 'HitTestTarget Class', link: '/api/hit-test-target' },
					{ text: 'XRButtonOptions', link: '/api/xr-button-options' },
					{ text: 'ARButton Class', link: '/api/ar-button' },
					{ text: 'VRButton Class', link: '/api/vr-button' },
				],
			},
		],

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/meta-quest/reality-accelerator-toolkit',
			},
		],

		footer: {
			copyright: 'Copyright © Meta Platforms, Inc',
		},
	},
	base: '/reality-accelerator-toolkit/',
});
