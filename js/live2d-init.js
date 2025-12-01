// Live2D initialization script using live2d-render library
(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLive2D);
    } else {
        initLive2D();
    }

    async function initLive2D() {
        try {
            // Check if Live2dRender is loaded
            if (typeof Live2dRender === 'undefined' || typeof Live2dRender.initializeLive2D !== 'function') {
                console.error('[Live2D] Live2dRender library not loaded');
                return;
            }

            console.log('[Live2D] Initializing Live2D model...');

            // Initialize Live2D with Mao model
            await Live2dRender.initializeLive2D({
                // Background color (transparent)
                BackgroundRGBA: [0.0, 0.0, 0.0, 0.0],

                // Path to the model3.json file
                ResourcesPath: '/live2d-model/Mao/Mao.model3.json',

                // Canvas size
                CanvasSize: {
                    height: 500,
                    width: 400
                },

                // Position on screen ('left' or 'right')
                CanvasPosition: 'right',

                // Show toolbox for controlling expressions
                ShowToolBox: true,

                // Enable caching with IndexedDB
                LoadFromCache: true,

                // External library URLs (using CDN)
                MinifiedJSUrl: 'https://unpkg.com/core-js-bundle@3.6.1/minified.js',
                Live2dCubismcoreUrl: 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js'
            });

            console.log('[Live2D] Live2D model loaded successfully!');

        } catch (error) {
            console.error('[Live2D] Failed to initialize:', error);
        }
    }
})();
