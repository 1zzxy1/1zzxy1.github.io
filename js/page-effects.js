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

  // ==================== 樱花飘落特效 ====================
  function initSakura() {
    const canvas = document.createElement('canvas');
    canvas.id = 'sakura-canvas';
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    const sakuras = [];
    const sakuraCount = 30;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    class Sakura {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -20;
        this.size = Math.random() * 12 + 8;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 3 - 1.5;
        this.opacity = Math.random() * 0.5 + 0.5;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;

        // 绘制樱花花瓣
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 183, 197, ${this.opacity})`;

        for (let i = 0; i < 5; i++) {
          const angle = (i * 72 - 90) * Math.PI / 180;
          const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;

          if (i === 0) {
            ctx.moveTo(
              Math.cos(angle) * this.size,
              Math.sin(angle) * this.size
            );
          } else {
            ctx.lineTo(
              Math.cos(angle) * this.size,
              Math.sin(angle) * this.size
            );
          }
          ctx.quadraticCurveTo(
            0, 0,
            Math.cos(innerAngle) * this.size * 0.4,
            Math.sin(innerAngle) * this.size * 0.4
          );
        }

        ctx.closePath();
        ctx.fill();

        // 花蕊
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 220, 100, ${this.opacity})`;
        ctx.fill();

        ctx.restore();
      }
    }

    function init() {
      resize();
      for (let i = 0; i < sakuraCount; i++) {
        const sakura = new Sakura();
        sakura.y = Math.random() * height;
        sakuras.push(sakura);
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      sakuras.forEach(sakura => {
        sakura.update();
        sakura.draw();
      });
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();
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

  // ==================== 页面加载动画 ====================
  function initPageTransition() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  }

  // ==================== 初始化 ====================
  function init() {
    // 等待锁屏验证后再初始化
    const checkAuth = setInterval(() => {
      const lockScreen = document.getElementById('site-lock');
      if (!lockScreen) {
        clearInterval(checkAuth);
        initReadingProgress();
        initSakura();
        initMouseStars();
      }
    }, 500);

    // 10秒后强制初始化
    setTimeout(() => {
      clearInterval(checkAuth);
      if (!document.getElementById('reading-progress')) {
        initReadingProgress();
        initSakura();
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
