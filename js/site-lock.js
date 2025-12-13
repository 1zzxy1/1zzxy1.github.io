// 【加强版】全站密码保护
(function() {
  'use strict';

  // ==================== 配置区 ====================
  const PASSWORD_HASH = '8c65e0195ce1c2c7919470551f2e161aff4a4203ff416aaf36cd159a4f44ff30';
  const STORAGE_KEY = 'site_access_token_v2';
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_TIME = 30 * 60 * 1000;
  const TOKEN_VALIDITY = 10 * 60 * 1000; // Token 有效期 10 分钟

  // ==================== 立即用 CSS 隐藏页面 ====================
  const hideStyle = document.createElement('style');
  hideStyle.id = 'site-lock-hide';
  hideStyle.textContent = 'body { visibility: hidden !important; }';
  document.head.appendChild(hideStyle);

  // ==================== 密码哈希函数 ====================
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ==================== 检查锁定状态 ====================
  function checkLockout() {
    const lockout = localStorage.getItem('site_lockout');
    if (lockout) {
      const lockoutData = JSON.parse(lockout);
      const now = Date.now();
      if (now - lockoutData.time < LOCKOUT_TIME) {
        return {
          locked: true,
          remainingTime: Math.ceil((LOCKOUT_TIME - (now - lockoutData.time)) / 60000)
        };
      } else {
        localStorage.removeItem('site_lockout');
        localStorage.removeItem('site_attempts');
      }
    }
    return { locked: false };
  }

  // ==================== 检查验证状态 ====================
  function checkAuth() {
    const token = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (token) {
      try {
        const data = JSON.parse(token);
        if (data.hash === PASSWORD_HASH && (now - data.time) < TOKEN_VALIDITY) {
          return true;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return false;
  }

  // ==================== 显示锁屏界面 ====================
  function showLockScreen() {
    const lockoutStatus = checkLockout();

    const lockHTML = `
      <div id="site-lock" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #667eea, #764ba2);
        background-size: 400% 400%;
        animation: gradient-bg 15s ease infinite;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        overflow: hidden;
      ">
        <div id="lock-particles"></div>
        <div id="lock-container" style="
          background: rgba(255, 255, 255, 0.15);
          padding: 50px 60px;
          border-radius: 30px;
          box-shadow: 0 25px 80px rgba(0,0,0,0.3), inset 0 0 30px rgba(255,255,255,0.1);
          text-align: center;
          max-width: 420px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          animation: float 6s ease-in-out infinite;
          position: relative;
          z-index: 2;
        ">
          <div style="
            font-size: 60px;
            margin-bottom: 15px;
            animation: pulse 2s ease-in-out infinite;
            filter: drop-shadow(0 0 20px rgba(255,255,255,0.5));
          ">🌸</div>
          <h2 style="
            margin: 0 0 10px 0;
            color: #fff;
            font-size: 28px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            letter-spacing: 2px;
          ">Rainor's Secret Garden</h2>
          <p id="lock-subtitle" style="
            margin: 0 0 25px 0;
            color: rgba(255,255,255,0.9);
            font-size: 14px;
            text-shadow: 0 1px 5px rgba(0,0,0,0.2);
          ">
            ${lockoutStatus.locked ?
              `⚠️ 尝试次数过多，请 ${lockoutStatus.remainingTime} 分钟后再试` :
              '✨ 欢迎来到私密树洞，请输入密码 ✨'}
          </p>
          <input type="password" id="site-password-input" placeholder="输入密码..."
            ${lockoutStatus.locked ? 'disabled' : ''}
            style="
            width: 100%;
            padding: 18px 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 15px;
            font-size: 16px;
            box-sizing: border-box;
            transition: all 0.3s ease;
            outline: none;
            background: rgba(255,255,255,0.2);
            color: #fff;
            text-align: center;
            letter-spacing: 3px;
            ${lockoutStatus.locked ? 'opacity: 0.5; cursor: not-allowed;' : ''}
          " />
          <button id="site-password-submit"
            ${lockoutStatus.locked ? 'disabled' : ''}
            style="
            width: 100%;
            padding: 18px;
            margin-top: 20px;
            background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 15px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            letter-spacing: 3px;
            text-shadow: 0 1px 3px rgba(0,0,0,0.2);
            ${lockoutStatus.locked ? 'opacity: 0.5; cursor: not-allowed;' : ''}
          ">${lockoutStatus.locked ? '已锁定' : '✦ 解锁 ✦'}</button>
          <div id="site-password-error" style="
            margin-top: 15px;
            color: #ffcccc;
            font-size: 14px;
            display: none;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          "></div>
          <div id="attempts-counter" style="
            margin-top: 12px;
            color: rgba(255,255,255,0.7);
            font-size: 12px;
          "></div>
          <div id="hitokoto-container" style="
            margin-top: 25px;
            color: rgba(255,255,255,0.7);
            font-size: 12px;
            min-height: 40px;
            line-height: 1.6;
          ">
            <span id="hitokoto-text">🌙 深夜的树洞，等待着你的到来</span>
            <span id="typing-cursor" style="animation: blink 1s infinite;">|</span>
          </div>
          <div id="hitokoto-from" style="
            color: rgba(255,255,255,0.4);
            font-size: 10px;
            margin-top: 5px;
          "></div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', lockHTML);
    document.body.style.overflow = 'hidden';

    // 创建背景粒子效果
    const particlesContainer = document.getElementById('lock-particles');
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'lock-particle';
      particle.style.width = Math.random() * 6 + 2 + 'px';
      particle.style.height = particle.style.width;
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 3 + 's';
      particle.style.animationDuration = Math.random() * 2 + 2 + 's';
      particlesContainer.appendChild(particle);
    }

    // 获取一言并显示打字机效果
    fetchHitokoto();

    async function fetchHitokoto() {
      try {
        const response = await fetch('https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d&c=i&c=k');
        const data = await response.json();
        typeWriter(data.hitokoto, data.from);
      } catch (e) {
        // 备用句子
        const fallbacks = [
          { text: '每个人都是一座孤岛，但我们可以隔海相望', from: '未知' },
          { text: '星星在哪里都是很亮的，就看你有没有抬头去看它们', from: '追风筝的人' },
          { text: '我们都在阴沟里，但仍有人仰望星空', from: '王尔德' },
          { text: '愿你出走半生，归来仍是少年', from: '苏轼' },
          { text: '人生如逆旅，我亦是行人', from: '苏轼' }
        ];
        const random = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        typeWriter(random.text, random.from);
      }
    }

    function typeWriter(text, from) {
      const textEl = document.getElementById('hitokoto-text');
      const fromEl = document.getElementById('hitokoto-from');
      textEl.textContent = '';
      let i = 0;

      function type() {
        if (i < text.length) {
          textEl.textContent += text.charAt(i);
          i++;
          setTimeout(type, 50 + Math.random() * 50);
        } else {
          if (from) {
            fromEl.textContent = '—— ' + from;
          }
        }
      }

      setTimeout(type, 500);
    }

    // 移除隐藏样式，显示锁屏
    const hideStyleElement = document.getElementById('site-lock-hide');
    if (hideStyleElement) hideStyleElement.remove();

    if (lockoutStatus.locked) return;

    const input = document.getElementById('site-password-input');
    const submit = document.getElementById('site-password-submit');
    const error = document.getElementById('site-password-error');
    const attemptsCounter = document.getElementById('attempts-counter');

    let attempts = parseInt(localStorage.getItem('site_attempts') || '0');
    updateAttemptsCounter();

    function updateAttemptsCounter() {
      const remaining = MAX_ATTEMPTS - attempts;
      if (remaining <= 3) {
        attemptsCounter.textContent = `剩余尝试次数: ${remaining}`;
        attemptsCounter.style.color = remaining <= 1 ? '#e74c3c' : '#f39c12';
      }
    }

    submit.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.4)';
    });

    submit.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });

    input.addEventListener('focus', function() {
      this.style.borderColor = 'rgba(255,255,255,0.6)';
      this.style.background = 'rgba(255,255,255,0.3)';
    });

    input.addEventListener('blur', function() {
      this.style.borderColor = 'rgba(255,255,255,0.3)';
      this.style.background = 'rgba(255,255,255,0.2)';
    });

    async function verify() {
      const password = input.value.trim();

      if (!password) {
        error.textContent = '请输入密码';
        error.style.display = 'block';
        return;
      }

      const inputHash = await sha256(password);

      if (inputHash === PASSWORD_HASH) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          hash: PASSWORD_HASH,
          time: Date.now()
        }));
        localStorage.removeItem('site_attempts');
        localStorage.removeItem('site_lockout');

        const lockScreen = document.getElementById('site-lock');
        lockScreen.style.opacity = '0';
        lockScreen.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          lockScreen.remove();
          document.body.style.overflow = '';
        }, 500);
      } else {
        attempts++;
        localStorage.setItem('site_attempts', attempts.toString());

        if (attempts >= MAX_ATTEMPTS) {
          localStorage.setItem('site_lockout', JSON.stringify({
            time: Date.now()
          }));
          error.textContent = '尝试次数过多，已被锁定 30 分钟';
          error.style.display = 'block';
          input.disabled = true;
          submit.disabled = true;
          submit.style.opacity = '0.5';
          submit.style.cursor = 'not-allowed';
          submit.textContent = '已锁定';
        } else {
          error.textContent = '密码错误，请重试';
          error.style.display = 'block';
          input.value = '';
          input.style.borderColor = '#e74c3c';
          input.focus();
          updateAttemptsCounter();

          const lockContainer = document.getElementById('lock-container');
          lockContainer.style.animation = 'shake 0.5s';
          setTimeout(() => {
            lockContainer.style.animation = '';
          }, 500);
        }
      }
    }

    submit.addEventListener('click', verify);
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') verify();
    });

    setTimeout(() => input.focus(), 100);
  }

  // ==================== 添加样式 ====================
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    @keyframes gradient-bg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    #site-password-input::placeholder {
      color: rgba(255,255,255,0.6);
    }
    #site-password-input:focus {
      border-color: rgba(255,255,255,0.6);
      background: rgba(255,255,255,0.3);
      box-shadow: 0 0 20px rgba(255,255,255,0.2);
    }
    #site-password-submit:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .lock-particle {
      position: absolute;
      background: rgba(255,255,255,0.6);
      border-radius: 50%;
      pointer-events: none;
      animation: twinkle 3s ease-in-out infinite;
    }
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ==================== 等待 DOM 加载完成 ====================
  function init() {
    if (!checkAuth()) {
      showLockScreen();
    } else {
      // 验证通过，移除隐藏样式
      const hideStyleElement = document.getElementById('site-lock-hide');
      if (hideStyleElement) hideStyleElement.remove();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
