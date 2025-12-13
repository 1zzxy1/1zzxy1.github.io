// ==================== 页面美化特效集合 ====================
// 🌸 Rainor's Secret Garden Effects 🌸
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
    const maxStars = 25;
    const symbols = ['✦', '✧', '⋆', '˚', '✩', '·'];

    document.addEventListener('mousemove', (e) => {
      if (stars.length < maxStars && Math.random() > 0.6) {
        createStar(e.clientX, e.clientY);
      }
    });

    function createStar(x, y) {
      const star = document.createElement('div');
      star.className = 'mouse-star';
      star.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
      const hue = Math.random() * 60 + 280; // 紫粉色系
      const size = Math.random() * 12 + 8;

      star.style.cssText = `
        position: fixed;
        left: ${x + (Math.random() - 0.5) * 20}px;
        top: ${y + (Math.random() - 0.5) * 20}px;
        color: hsl(${hue}, 100%, 75%);
        font-size: ${size}px;
        pointer-events: none;
        z-index: 9999;
        animation: star-fade 1.2s ease-out forwards;
        transform: translate(-50%, -50%);
        text-shadow: 0 0 10px hsl(${hue}, 100%, 75%);
      `;
      document.body.appendChild(star);
      stars.push(star);

      setTimeout(() => {
        star.remove();
        stars.shift();
      }, 1200);
    }
  }

  // ==================== 鼠标点击涟漪效果 ====================
  function initClickRipple() {
    document.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      ripple.className = 'click-ripple';
      ripple.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9998;
        animation: ripple-expand 0.6s ease-out forwards;
      `;
      document.body.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  }

  // ==================== 文字渐现效果 ====================
  function initTextReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.post-body p, .post-body h1, .post-body h2, .post-body h3, .post-body h4, .post-body li').forEach(el => {
      el.classList.add('reveal-text');
      observer.observe(el);
    });
  }

  // ==================== 图片懒加载动画 ====================
  function initImageAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('img-loaded');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.post-body img').forEach(img => {
      img.classList.add('img-reveal');
      observer.observe(img);
    });
  }

  // ==================== 平滑滚动增强 ====================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ==================== 打字机效果（用于标题） ====================
  function initTypewriter() {
    const title = document.querySelector('.site-subtitle');
    if (!title || title.dataset.typed) return;

    title.dataset.typed = 'true';
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '2px solid #667eea';

    let i = 0;
    function type() {
      if (i < text.length) {
        title.textContent += text.charAt(i);
        i++;
        setTimeout(type, 100);
      } else {
        setTimeout(() => {
          title.style.borderRight = 'none';
        }, 500);
      }
    }

    setTimeout(type, 500);
  }

  // ==================== 添加动画样式 ====================
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes star-fade {
        0% {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1) rotate(0deg);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -100%) scale(0.3) rotate(180deg);
        }
      }

      @keyframes ripple-expand {
        0% {
          width: 0;
          height: 0;
          opacity: 1;
        }
        100% {
          width: 200px;
          height: 200px;
          opacity: 0;
        }
      }

      .reveal-text {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      .reveal-text.revealed {
        opacity: 1;
        transform: translateY(0);
      }

      .img-reveal {
        opacity: 0;
        transform: scale(0.95);
        transition: all 0.5s ease;
      }

      .img-reveal.img-loaded {
        opacity: 1;
        transform: scale(1);
      }

      /* 鼠标悬停卡片光效 */
      .post-block {
        position: relative;
        overflow: hidden;
      }

      .post-block::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          to bottom right,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0) 40%,
          rgba(255, 255, 255, 0.1) 50%,
          rgba(255, 255, 255, 0) 60%,
          rgba(255, 255, 255, 0) 100%
        );
        transform: rotate(45deg);
        transition: all 0.5s ease;
        opacity: 0;
        pointer-events: none;
      }

      .post-block:hover::after {
        animation: card-shine 0.8s ease forwards;
      }

      @keyframes card-shine {
        0% {
          top: -50%;
          left: -50%;
          opacity: 1;
        }
        100% {
          top: 150%;
          left: 150%;
          opacity: 0;
        }
      }

      /* 链接悬停波纹 */
      a {
        position: relative;
      }

      /* 页面切换淡入 */
      .container {
        animation: pageIn 0.5s ease-out;
      }

      @keyframes pageIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // ==================== 初始化 ====================
  function init() {
    addStyles();

    // 等待锁屏验证后再初始化
    const checkAuth = setInterval(() => {
      const lockScreen = document.getElementById('site-lock');
      if (!lockScreen) {
        clearInterval(checkAuth);
        initReadingProgress();
        initMouseStars();
        initClickRipple();
        initTextReveal();
        initImageAnimation();
        initSmoothScroll();
        initTypewriter();
      }
    }, 500);

    // 10秒后强制初始化
    setTimeout(() => {
      clearInterval(checkAuth);
      if (!document.getElementById('reading-progress')) {
        initReadingProgress();
        initMouseStars();
        initClickRipple();
        initTextReveal();
        initImageAnimation();
        initSmoothScroll();
        initTypewriter();
      }
    }, 10000);
  }

  // PJAX 支持 - 页面切换时重新初始化
  document.addEventListener('pjax:complete', () => {
    initTextReveal();
    initImageAnimation();
    initTypewriter();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
