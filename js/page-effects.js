// ==================== 页面美化特效集合 ====================
(function() {
  'use strict';

  // ==================== 阅读进度条 ====================
  function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    document.body.appendChild(progressBar);

    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // ==================== 鼠标跟随星星特效 ====================
  function initMouseStars() {
    const stars = [];
    const maxStars = 20;

    document.addEventListener('mousemove', (e) => {
      if (stars.length < maxStars && Math.random() > 0.7) {
        createStar(e.clientX, e.clientY);
      }
    });

    function createStar(x, y) {
      const star = document.createElement('div');
      star.className = 'mouse-star';
      star.innerHTML = '✦';
      star.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        color: hsl(${Math.random() * 60 + 300}, 100%, 70%);
        font-size: ${Math.random() * 15 + 10}px;
        pointer-events: none;
        z-index: 9999;
        animation: star-fade 1s ease-out forwards;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(star);
      stars.push(star);

      setTimeout(() => {
        star.remove();
        stars.shift();
      }, 1000);
    }

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
      @keyframes star-fade {
        0% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -100%) scale(0.5) rotate(180deg);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ==================== 初始化 ====================
  function init() {
    // 等待锁屏验证后再初始化
    const checkAuth = setInterval(() => {
      const lockScreen = document.getElementById('site-lock');
      if (!lockScreen) {
        clearInterval(checkAuth);
        initReadingProgress();
        initMouseStars();
      }
    }, 500);

    // 10秒后强制初始化
    setTimeout(() => {
      clearInterval(checkAuth);
      if (!document.getElementById('reading-progress')) {
        initReadingProgress();
        initMouseStars();
      }
    }, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
