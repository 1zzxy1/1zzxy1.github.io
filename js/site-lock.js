// 全站密码保护
(function() {
  'use strict';

  const SITE_PASSWORD = 'gemini'; // 修改这里设置密码
  const STORAGE_KEY = 'site_access_token';

  // 检查是否已验证
  function checkAuth() {
    const token = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (token) {
      try {
        const data = JSON.parse(token);
        // Token 有效期 7 天
        if (data.password === SITE_PASSWORD && (now - data.time) < 7 * 24 * 60 * 60 * 1000) {
          return true;
        }
      } catch (e) {}
    }
    return false;
  }

  // 显示密码输入界面
  function showLockScreen() {
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
        z-index: 99999;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      ">
        <div style="
          background: rgba(255, 255, 255, 0.95);
          padding: 40px 50px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
          max-width: 400px;
          backdrop-filter: blur(10px);
        ">
          <div style="font-size: 48px; margin-bottom: 10px;">🔒</div>
          <h2 style="margin: 0 0 10px 0; color: #333; font-size: 24px;">私密博客</h2>
          <p style="margin: 0 0 30px 0; color: #666; font-size: 14px;">请输入访问密码</p>
          <input type="password" id="site-password-input" placeholder="输入密码..." style="
            width: 100%;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 10px;
            font-size: 16px;
            box-sizing: border-box;
            transition: border 0.3s;
            outline: none;
          " />
          <button id="site-password-submit" style="
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
          ">解锁</button>
          <div id="site-password-error" style="
            margin-top: 15px;
            color: #e74c3c;
            font-size: 14px;
            display: none;
          ">密码错误，请重试</div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', lockHTML);
    document.body.style.overflow = 'hidden';

    const input = document.getElementById('site-password-input');
    const submit = document.getElementById('site-password-submit');
    const error = document.getElementById('site-password-error');

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

    function verify() {
      const password = input.value;

      if (password === SITE_PASSWORD) {
        // 保存验证信息
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          password: password,
          time: Date.now()
        }));

        // 移除锁屏
        const lockScreen = document.getElementById('site-lock');
        lockScreen.style.opacity = '0';
        lockScreen.style.transition = 'opacity 0.5s';
        setTimeout(() => {
          lockScreen.remove();
          document.body.style.overflow = '';
        }, 500);
      } else {
        error.style.display = 'block';
        input.value = '';
        input.style.borderColor = '#e74c3c';
        input.focus();

        // 抖动效果
        const lockDiv = document.querySelector('#site-lock > div');
        lockDiv.style.animation = 'shake 0.5s';
        setTimeout(() => {
          lockDiv.style.animation = '';
        }, 500);
      }
    }

    submit.addEventListener('click', verify);
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') verify();
    });

    // 自动聚焦
    setTimeout(() => input.focus(), 100);
  }

  // 添加抖动动画
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
      20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
  `;
  document.head.appendChild(style);

  // 页面加载时检查权限
  if (!checkAuth()) {
    showLockScreen();
  }
})();
