// 【加强版】全站密码保护
(function() {
  'use strict';

  // ==================== 配置区 ====================
  // 密码的 SHA-256 哈希值（gemini 的哈希）
  const PASSWORD_HASH = '5d72436256ada53828b51895a94bb8489e9f1ac4fe937a8024ef1594e7045ff6';
  const STORAGE_KEY = 'site_access_token_v2';
  const MAX_ATTEMPTS = 5; // 最大尝试次数
  const LOCKOUT_TIME = 30 * 60 * 1000; // 锁定时间 30 分钟
  const TOKEN_VALIDITY = 24 * 60 * 60 * 1000; // Token 有效期 24 小时

  // ==================== 密码哈希函数 ====================
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ==================== 立即隐藏页面内容 ====================
  const contentHider = document.createElement('div');
  contentHider.id = 'content-hider';
  contentHider.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #000;
    z-index: 999999;
    display: block;
  `;
  document.documentElement.appendChild(contentHider);

  // ==================== 防护措施 ====================
  // 禁用右键菜单
  document.addEventListener('contextmenu', e => e.preventDefault());

  // 禁用 F12、Ctrl+Shift+I 等开发者工具快捷键
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')) {
      e.preventDefault();
      return false;
    }
  });

  // 禁用文本选择
  document.addEventListener('selectstart', e => e.preventDefault());

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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      ">
        <div id="lock-container" style="
          background: rgba(255, 255, 255, 0.95);
          padding: 40px 50px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
          max-width: 400px;
          backdrop-filter: blur(10px);
        ">
          <div style="font-size: 48px; margin-bottom: 10px;">🔒</div>
          <h2 style="margin: 0 0 10px 0; color: #333; font-size: 24px;">私密空间</h2>
          <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">
            ${lockoutStatus.locked ?
              `⚠️ 尝试次数过多，请 ${lockoutStatus.remainingTime} 分钟后再试` :
              '这是 Rainor 的私密树洞，请输入密码'}
          </p>
          <input type="password" id="site-password-input" placeholder="输入密码..."
            ${lockoutStatus.locked ? 'disabled' : ''}
            style="
            width: 100%;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-size: 16px;
            box-sizing: border-box;
            transition: border 0.3s;
            outline: none;
            ${lockoutStatus.locked ? 'opacity: 0.5; cursor: not-allowed;' : ''}
          " />
          <button id="site-password-submit"
            ${lockoutStatus.locked ? 'disabled' : ''}
            style="
            width: 100%;
            padding: 15px;
            margin-top: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            font-weight: 600;
            ${lockoutStatus.locked ? 'opacity: 0.5; cursor: not-allowed;' : ''}
          ">${lockoutStatus.locked ? '已锁定' : '解锁'}</button>
          <div id="site-password-error" style="
            margin-top: 15px;
            color: #e74c3c;
            font-size: 14px;
            display: none;
          "></div>
          <div id="attempts-counter" style="
            margin-top: 10px;
            color: #999;
            font-size: 12px;
          "></div>
        </div>
      </div>
    `;

    contentHider.insertAdjacentHTML('beforeend', lockHTML);
    document.body.style.overflow = 'hidden';

    if (lockoutStatus.locked) return;

    const input = document.getElementById('site-password-input');
    const submit = document.getElementById('site-password-submit');
    const error = document.getElementById('site-password-error');
    const attemptsCounter = document.getElementById('attempts-counter');

    // 获取当前尝试次数
    let attempts = parseInt(localStorage.getItem('site_attempts') || '0');
    updateAttemptsCounter();

    function updateAttemptsCounter() {
      const remaining = MAX_ATTEMPTS - attempts;
      if (remaining <= 3) {
        attemptsCounter.textContent = `剩余尝试次数: ${remaining}`;
        attemptsCounter.style.color = remaining <= 1 ? '#e74c3c' : '#f39c12';
      }
    }

    // 按钮悬停效果
    submit.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.4)';
    });

    submit.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });

    // 输入框焦点效果
    input.addEventListener('focus', function() {
      this.style.borderColor = '#667eea';
    });

    input.addEventListener('blur', function() {
      this.style.borderColor = '#ddd';
    });

    async function verify() {
      const password = input.value.trim();

      if (!password) {
        error.textContent = '请输入密码';
        error.style.display = 'block';
        return;
      }

      // 计算输入密码的哈希值
      const inputHash = await sha256(password);

      if (inputHash === PASSWORD_HASH) {
        // 密码正确，保存验证信息
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          hash: PASSWORD_HASH,
          time: Date.now()
        }));
        localStorage.removeItem('site_attempts');
        localStorage.removeItem('site_lockout');

        // 移除锁屏
        const lockScreen = document.getElementById('site-lock');
        lockScreen.style.opacity = '0';
        lockScreen.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          contentHider.remove();
          document.body.style.overflow = '';
        }, 500);
      } else {
        // 密码错误
        attempts++;
        localStorage.setItem('site_attempts', attempts.toString());

        if (attempts >= MAX_ATTEMPTS) {
          // 达到最大尝试次数，锁定
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

          // 抖动效果
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

    // 自动聚焦
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

    body.locked {
      overflow: hidden !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
    }
  `;
  document.head.appendChild(style);

  // ==================== 初始化 ====================
  if (!checkAuth()) {
    document.body.classList.add('locked');
    showLockScreen();
  } else {
    // 验证通过，移除内容隐藏层
    contentHider.remove();
  }
})();
