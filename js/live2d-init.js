// Live2D initialization script using live2d-render library
(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLive2D);
    } else {
        // Wait a bit for other scripts to load
        setTimeout(initLive2D, 1000);
    }

    async function initLive2D() {
        try {
            console.log('[Live2D] Starting initialization...');

            // Check if Live2dRender is loaded
            if (typeof Live2dRender === 'undefined') {
                console.error('[Live2D] Live2dRender library not found');
                return;
            }

            if (typeof Live2dRender.initializeLive2D !== 'function') {
                console.error('[Live2D] initializeLive2D function not found');
                return;
            }

            console.log('[Live2D] Live2dRender library loaded successfully');
            console.log('[Live2D] Initializing Live2D model...');

            // Use absolute path from root (lowercase folder name!)
            var modelPath = '/live2d-model/mao/Mao.model3.json';
            console.log('[Live2D] Model path:', modelPath);

            // Initialize Live2D with Mao model
            await Live2dRender.initializeLive2D({
                // Background color (transparent)
                BackgroundRGBA: [0.0, 0.0, 0.0, 0.0],

                // Path to the model3.json file
                ResourcesPath: modelPath,

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
                LoadFromCache: false, // Disable cache for debugging

                // External library URLs (using CDN)
                MinifiedJSUrl: 'https://cdn.jsdelivr.net/npm/core-js-bundle@3.6.1/minified.js',
                Live2dCubismcoreUrl: 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js'
            });

            console.log('[Live2D] Live2D model loaded successfully!');

        } catch (error) {
            console.error('[Live2D] Failed to initialize:', error);
            console.error('[Live2D] Error stack:', error.stack);
        }
    }
})();
