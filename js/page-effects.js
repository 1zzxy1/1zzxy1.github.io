// ==================== 页面美化特效集合 ====================
// 🌸 Rainor's Secret Garden Effects - Ultimate Edition 🌸
(function() {
  'use strict';

  // ==================== 强制锁定夜间模式（立即执行） ====================
  (function forceDarkMode() {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  })();

  // ==================== 树洞隐藏系统（立即执行） ====================
  // 必须在 DOM 加载前就添加样式，防止秘密文章闪现
  (function initSecretStylesImmediately() {
    const style = document.createElement('style');
    style.id = 'secret-post-styles';
    style.textContent = `
      /* 树洞隐藏系统 - 立即生效 */
      body:not(.secret-unlocked) .secret-post {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        min-height: 0 !important;
        max-height: 0 !important;
        width: 0 !important;
        min-width: 0 !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        position: absolute !important;
        left: -9999px !important;
        pointer-events: none !important;
      }
      body:not(.secret-unlocked) li.secret-post,
      body:not(.secret-unlocked) article.secret-post,
      body:not(.secret-unlocked) .item.secret-post,
      body:not(.secret-unlocked) .segments .secret-post {
        display: none !important;
        position: absolute !important;
        left: -9999px !important;
      }
    `;
    // 插入到 head 的最前面以确保优先级
    if (document.head) {
      document.head.insertBefore(style, document.head.firstChild);
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        document.head.insertBefore(style, document.head.firstChild);
      });
    }

    // 立即检查是否已解锁
    if (sessionStorage.getItem('secret_unlocked') === 'true') {
      document.body && document.body.classList.add('secret-unlocked');
      // 如果 body 还不存在，等 DOM 加载后再添加
      document.addEventListener('DOMContentLoaded', function() {
        document.body.classList.add('secret-unlocked');
      });
    }
  })();

  // ==================== 鼠标彩带拖尾 ====================
  function initRibbonTrail() {
    const canvas = document.createElement('canvas');
    canvas.id = 'ribbon-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9997;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const trail = [];
    const maxTrail = 20;

    document.addEventListener('mousemove', (e) => {
      trail.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (trail.length > maxTrail) trail.shift();
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);
      if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          const p = trail[i], pp = trail[i - 1];
          ctx.quadraticCurveTo(pp.x, pp.y, (p.x + pp.x) / 2, (p.y + pp.y) / 2);
        }
        const gradient = ctx.createLinearGradient(trail[0].x, trail[0].y, trail[trail.length-1].x, trail[trail.length-1].y);
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0)');
        gradient.addColorStop(0.5, 'rgba(118, 75, 162, 0.4)');
        gradient.addColorStop(1, 'rgba(240, 147, 251, 0.6)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age++;
        if (trail[i].age > 8) trail.splice(i, 1);
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ==================== 粒子背景 ====================
  function initParticleBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-bg';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.5;';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(102, 126, 234, ${p.opacity})`;
        ctx.fill();
      });
      // 连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(102, 126, 234, ${0.15 * (1 - dist / 120)})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ==================== 阅读进度条 ====================
  function initReadingProgress() {
    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    document.body.appendChild(bar);
    function update() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // ==================== 鼠标星星 ====================
  function initMouseStars() {
    const stars = [];
    const symbols = ['✦', '✧', '⋆', '˚', '✩', '·'];
    document.addEventListener('mousemove', (e) => {
      if (stars.length < 25 && Math.random() > 0.7) {
        const star = document.createElement('div');
        star.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        const hue = Math.random() * 60 + 280;
        star.style.cssText = `position:fixed;left:${e.clientX + (Math.random()-0.5)*20}px;top:${e.clientY + (Math.random()-0.5)*20}px;color:hsl(${hue},100%,75%);font-size:${Math.random()*12+8}px;pointer-events:none;z-index:9999;animation:star-fade 1.2s ease-out forwards;text-shadow:0 0 10px hsl(${hue},100%,75%);`;
        document.body.appendChild(star);
        stars.push(star);
        setTimeout(() => { star.remove(); stars.shift(); }, 1200);
      }
    });
  }

  // ==================== 点击涟漪 ====================
  function initClickRipple() {
    document.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      ripple.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:0;height:0;border-radius:50%;background:radial-gradient(circle,rgba(102,126,234,0.4) 0%,transparent 70%);transform:translate(-50%,-50%);pointer-events:none;z-index:9998;animation:ripple-expand 0.6s ease-out forwards;`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  // ==================== 代码复制按钮 ====================
  function initCodeCopy() {
    document.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.code-copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.innerHTML = '📋';
      btn.title = '复制代码';
      pre.style.position = 'relative';
      pre.appendChild(btn);
      pre.addEventListener('mouseenter', () => btn.style.opacity = '1');
      pre.addEventListener('mouseleave', () => btn.style.opacity = '0');
      btn.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent || pre.textContent;
        try {
          await navigator.clipboard.writeText(code);
          btn.innerHTML = '✅';
          setTimeout(() => btn.innerHTML = '📋', 2000);
        } catch (e) {
          btn.innerHTML = '❌';
          setTimeout(() => btn.innerHTML = '📋', 2000);
        }
      });
    });
  }

  // ==================== 暗色模式切换动画 ====================
  function initDarkModeTransition() {
    const btn = document.querySelector('.darkmode');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const overlay = document.createElement('div');
      const isDark = document.documentElement.dataset.theme === 'dark';
      overlay.style.cssText = `position:fixed;top:50%;left:50%;width:0;height:0;border-radius:50%;background:${isDark ? '#fff' : '#1a1a2e'};transform:translate(-50%,-50%);z-index:99999;pointer-events:none;transition:all 0.5s ease;`;
      document.body.appendChild(overlay);
      requestAnimationFrame(() => {
        const maxDim = Math.max(window.innerWidth, window.innerHeight) * 2;
        overlay.style.width = overlay.style.height = maxDim + 'px';
      });
      setTimeout(() => overlay.remove(), 600);
    });
  }

  // ==================== 文字渐现 ====================
  function initTextReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.post-body p, .post-body h1, .post-body h2, .post-body h3, .post-body h4, .post-body li').forEach(el => {
      el.classList.add('reveal-text');
      observer.observe(el);
    });
  }

  // ==================== 图片动画 ====================
  function initImageAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('img-loaded');
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.post-body img').forEach(img => {
      img.classList.add('img-reveal');
      observer.observe(img);
    });
  }

  // ==================== 打字机效果 ====================
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
        setTimeout(() => title.style.borderRight = 'none', 500);
      }
    }
    setTimeout(type, 500);
  }

  // ==================== 网站运行时间 + 访客统计 ====================
  function initRuntime() {
    const footer = document.querySelector('footer .inner, footer, .copyright');
    if (!footer) return;
    if (document.getElementById('site-stats')) return; // 防止重复初始化
    const startDate = new Date('2025-12-01');

    const statsDiv = document.createElement('div');
    statsDiv.id = 'site-stats';
    statsDiv.style.cssText = 'text-align:center;font-size:12px;color:rgba(102,126,234,0.8);margin-top:15px;line-height:2;';
    footer.appendChild(statsDiv);

    // 保存 busuanzi 的值（如果已经加载）
    let pvValue = '--';
    let uvValue = '--';

    function updateRuntime() {
      const now = new Date();
      const diff = now - startDate;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // 检查 busuanzi 是否已更新值
      const pvEl = document.getElementById('busuanzi_value_site_pv');
      const uvEl = document.getElementById('busuanzi_value_site_uv');
      if (pvEl && pvEl.textContent && pvEl.textContent !== '--') pvValue = pvEl.textContent;
      if (uvEl && uvEl.textContent && uvEl.textContent !== '--') uvValue = uvEl.textContent;

      statsDiv.innerHTML = `
        <div>🌸 小站已运行 <span style="color:#667eea;font-weight:bold;">${days}</span> 天 <span style="color:#764ba2;font-weight:bold;">${hours}</span> 小时 <span style="color:#f093fb;font-weight:bold;">${minutes}</span> 分 <span style="color:#f5576c;font-weight:bold;">${seconds}</span> 秒 🌸</div>
        <div style="margin-top:5px;">👀 本站总访问 <span id="busuanzi_value_site_pv" style="color:#667eea;font-weight:bold;">${pvValue}</span> 次 | 访客 <span id="busuanzi_value_site_uv" style="color:#764ba2;font-weight:bold;">${uvValue}</span> 人</div>
      `;
    }
    updateRuntime();
    setInterval(updateRuntime, 1000);

    // 重新加载 busuanzi 脚本以填充统计数据
    setTimeout(function() {
      const script = document.createElement('script');
      script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
      script.async = true;
      document.body.appendChild(script);
    }, 100);
  }

  // ==================== 树洞解锁系统 ====================
  function initSecretUnlock() {
    console.log('[Secret Button] Init called');

    // 检查是否已解锁
    const isUnlocked = sessionStorage.getItem('secret_unlocked') === 'true';

    // 如果已解锁，添加解锁状态 class
    if (isUnlocked) {
      document.body.classList.add('secret-unlocked');
    }

    // 创建解锁按钮（在页脚的status区域）
    // 使用延迟和重试机制确保DOM已加载
    let retryCount = 0;
    const maxRetries = 20;

    function tryCreateButton() {
      // 尝试多个选择器
      const footer = document.querySelector('.status') ||
                     document.querySelector('footer .inner') ||
                     document.querySelector('#footer .inner') ||
                     document.querySelector('#footer');

      if (!footer) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`[Secret Button] Retry ${retryCount}/${maxRetries}...`);
          setTimeout(tryCreateButton, 200);
        } else {
          console.error('[Secret Button] Failed to find footer element');
        }
        return;
      }

      if (document.getElementById('secret-unlock-btn')) {
        console.log('[Secret Button] Button already exists');
        return;
      }

      console.log('[Secret Button] Creating button in:', footer);

      const unlockBtn = document.createElement('div');
      unlockBtn.id = 'secret-unlock-btn';
      unlockBtn.innerHTML = isUnlocked ? '🔓' : '🔐';
      unlockBtn.title = isUnlocked ? '树洞已解锁（点击锁定）' : '解锁隐藏的树洞文章';
      unlockBtn.style.cssText = `
        display: block !important;
        margin: 15px 0 !important;
        padding: 10px 20px !important;
        font-size: 24px !important;
        cursor: pointer !important;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border-radius: 25px !important;
        transition: all 0.3s ease !important;
        user-select: none !important;
        width: fit-content !important;
        text-align: center !important;
        box-shadow: 0 2px 8px rgba(102,126,234,0.3) !important;
        z-index: 9999 !important;
        position: relative !important;
      `;
      footer.appendChild(unlockBtn);
      console.log('[Secret Button] Button created successfully');


      // 点击事件
      unlockBtn.addEventListener('click', function() {
        if (sessionStorage.getItem('secret_unlocked') === 'true') {
          // 已解锁，点击锁定
          sessionStorage.removeItem('secret_unlocked');
          document.body.classList.remove('secret-unlocked');
          unlockBtn.innerHTML = '🔐';
          unlockBtn.title = '解锁隐藏的树洞文章';
          showToast('树洞已锁定 🔒');
        } else {
          // 未解锁，显示密码输入框
          showPasswordDialog();
        }
      });

      // 悬停效果
      unlockBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 5px 20px rgba(102,126,234,0.5)';
      });
      unlockBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
      });
    }

    // 开始尝试创建按钮
    tryCreateButton();
  }

  // 显示密码输入对话框
  function showPasswordDialog() {
    // 创建遮罩
    const overlay = document.createElement('div');
    overlay.id = 'secret-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(5px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    `;

    // 创建对话框
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: linear-gradient(145deg, #1a1a2e, #16213e);
      border: 1px solid rgba(102,126,234,0.3);
      border-radius: 20px;
      padding: 30px 40px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      animation: slideUp 0.3s ease;
    `;
    dialog.innerHTML = `
      <div style="font-size: 40px; margin-bottom: 15px;">🌙</div>
      <h3 style="color: #f093fb; margin-bottom: 20px; font-size: 18px;">进入树洞</h3>
      <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin-bottom: 20px;">输入密码查看隐藏的树洞文章</p>
      <input type="password" id="secret-password-input" placeholder="请输入密码..." style="
        width: 200px;
        padding: 12px 20px;
        border: 1px solid rgba(102,126,234,0.3);
        border-radius: 25px;
        background: rgba(255,255,255,0.05);
        color: #fff;
        font-size: 14px;
        outline: none;
        text-align: center;
        transition: all 0.3s ease;
      ">
      <div style="margin-top: 20px;">
        <button id="secret-submit-btn" style="
          padding: 10px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 20px;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          margin-right: 10px;
          transition: all 0.3s ease;
        ">解锁</button>
        <button id="secret-cancel-btn" style="
          padding: 10px 30px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        ">取消</button>
      </div>
      <p id="secret-error-msg" style="color: #f5576c; font-size: 12px; margin-top: 15px; display: none;">密码错误，请重试</p>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // 聚焦输入框
    const input = document.getElementById('secret-password-input');
    setTimeout(() => input.focus(), 100);

    // 事件绑定
    document.getElementById('secret-submit-btn').addEventListener('click', verifyPassword);
    document.getElementById('secret-cancel-btn').addEventListener('click', closeDialog);
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') verifyPassword();
    });
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeDialog();
    });

    function verifyPassword() {
      const password = input.value.trim();
      // 密码验证：gemini
      if (password === 'gemini') {
        sessionStorage.setItem('secret_unlocked', 'true');
        document.body.classList.add('secret-unlocked');
        const btn = document.getElementById('secret-unlock-btn');
        if (btn) {
          btn.innerHTML = '🔓';
          btn.title = '树洞已解锁（点击锁定）';
        }
        closeDialog();
        showToast('树洞已解锁 ✨');
      } else {
        document.getElementById('secret-error-msg').style.display = 'block';
        input.style.borderColor = '#f5576c';
        input.value = '';
        setTimeout(() => {
          input.style.borderColor = 'rgba(102,126,234,0.3)';
        }, 1000);
      }
    }

    function closeDialog() {
      overlay.style.animation = 'fadeOut 0.2s ease forwards';
      setTimeout(() => overlay.remove(), 200);
    }
  }

  // Toast 提示
  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 25px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border-radius: 25px;
      font-size: 14px;
      z-index: 999999;
      animation: toastIn 0.3s ease;
      box-shadow: 0 5px 20px rgba(102,126,234,0.4);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // ==================== 添加样式 ====================
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* 动画 */
      @keyframes star-fade {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
        100% { opacity: 0; transform: translate(-50%, -100%) scale(0.3) rotate(180deg); }
      }
      @keyframes ripple-expand {
        0% { width: 0; height: 0; opacity: 1; }
        100% { width: 200px; height: 200px; opacity: 0; }
      }

      /* 文字渐现 */
      .reveal-text { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      .reveal-text.revealed { opacity: 1; transform: translateY(0); }

      /* 图片动画 */
      .img-reveal { opacity: 0; transform: scale(0.95); transition: all 0.5s ease; }
      .img-reveal.img-loaded { opacity: 1; transform: scale(1); }

      /* 卡片光效 */
      .post-block { position: relative; overflow: hidden; }
      .post-block::after {
        content: '';
        position: absolute;
        top: -50%; left: -50%;
        width: 200%; height: 200%;
        background: linear-gradient(to bottom right, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 60%, rgba(255,255,255,0) 100%);
        transform: rotate(45deg);
        opacity: 0;
        pointer-events: none;
        z-index: 1;
      }
      .post-block:hover::after { animation: card-shine 0.8s ease forwards; }
      @keyframes card-shine {
        0% { top: -50%; left: -50%; opacity: 1; }
        100% { top: 150%; left: 150%; opacity: 0; }
      }

      /* 代码复制按钮 */
      .code-copy-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 5px 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 14px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 10;
      }
      .code-copy-btn:hover { transform: scale(1.1); box-shadow: 0 5px 15px rgba(102,126,234,0.4); }

      /* 页面淡入 */
      .container { animation: pageIn 0.5s ease-out; }
      @keyframes pageIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* 树洞隐藏系统 - 只在未解锁时隐藏 */
      body:not(.secret-unlocked) .secret-post,
      body:not(.secret-unlocked) li.secret-post,
      body:not(.secret-unlocked) article.secret-post,
      body:not(.secret-unlocked) .item.secret-post {
        display: none !important;
        position: absolute !important;
        left: -9999px !important;
      }

      /* 树洞对话框动画 */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes toastIn {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      @keyframes toastOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(20px); }
      }
    `;
    document.head.appendChild(style);
  }

  // ==================== 初始化 ====================
  function init() {
    addStyles();
    // initRibbonTrail();  // 禁用：光标拖影
    // initParticleBackground();  // 禁用：粒子背景
    initReadingProgress();
    // initMouseStars();  // 禁用：鼠标星星
    // initClickRipple();  // 禁用：点击涟漪
    initCodeCopy();
    initDarkModeTransition();
    // initTextReveal();  // 禁用：文字渐现
    // initImageAnimation();  // 禁用：图片动画
    // initTypewriter();  // 禁用：打字机效果
    initRuntime();
    initSecretUnlock();
  }

  // ==================== 主题切换功能 ====================
  function initThemeToggle() {
    const toggleBtns = document.querySelectorAll('.theme-toggle');

    toggleBtns.forEach(btn => {
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', function() {
        // 切换暗色模式
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';

        if (isDark) {
          html.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
          // 更新图标
          this.innerHTML = '<i class="ic i-sun"></i>';
        } else {
          html.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
          // 更新图标
          this.innerHTML = '<i class="ic i-moon"></i>';
        }

        // 触发Shoka主题的暗色模式切换
        if (typeof window.changeTheme === 'function') {
          window.changeTheme();
        }
      });
    });

    // 恢复之前的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggleBtns.forEach(btn => {
        btn.innerHTML = '<i class="ic i-moon"></i>';
      });
    }
  }

  document.addEventListener('pjax:complete', () => {
    initCodeCopy();
    initTextReveal();
    initImageAnimation();
    initTypewriter();
    initDarkModeTransition();
    initSecretUnlock();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
