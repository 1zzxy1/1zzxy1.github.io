const posts = [
  {
    title: "ROS 通信链路学习笔记",
    url: "/posts/ros-communication/",
    desc: "从 TCP/UDP、字节序、mDNS 到 Socket 编程，梳理 ROS 通信背后的网络基础。",
    tags: "ROS2 机器人 网络通信"
  },
  {
    title: "香橙派 AIpro 部署 Qwen 实战笔记",
    url: "/posts/orangepi-qwen/",
    desc: "记录 NPU 环境配置、FastLLM 编译和模型量化部署的完整实践路线。",
    tags: "AI 嵌入式 Qwen NPU"
  },
  {
    title: "Claude 的两个开源框架：BMAD Method 与 Claude-Flow",
    url: "/posts/ai-dev-frameworks/",
    desc: "把 AI 敏捷开发和多代理编排放在一起看，理解下一代 AI 编程工作流。",
    tags: "AI Agent 开发工具"
  },
  {
    title: "ROS 记录 1：ROS 2 核心概念大揭秘",
    url: "/posts/ros-core/",
    desc: "用直观方式理解 Node、Topic、Service、Action 这些 ROS 2 的关键概念。",
    tags: "ROS2 教程"
  },
  {
    title: "探索 Google Gemini：新一代多模态 AI 模型使用指南",
    url: "/posts/gemini-guide/",
    desc: "从模型能力、使用入口到实践场景，整理 Gemini 的上手路径。",
    tags: "AI Gemini 多模态"
  }
];

const year = document.querySelector("[data-year]");
if (year) {
  year.textContent = new Date().getFullYear();
}

const root = document.documentElement;
const savedTheme = localStorage.getItem("site-theme");
root.dataset.theme = savedTheme || "light";

document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    localStorage.setItem("site-theme", nextTheme);
  });
});

window.addEventListener("load", () => {
  const loading = document.querySelector("[data-loading]");
  if (loading) {
    window.setTimeout(() => loading.classList.add("is-hidden"), 220);
  }
});

const modal = document.querySelector("[data-search-modal]");
const searchInput = document.querySelector("[data-search-input]");
const results = document.querySelector("[data-search-results]");

function renderResults(query = "") {
  if (!results) return;
  const normalized = query.trim().toLowerCase();
  const matched = normalized
    ? posts.filter((post) => `${post.title} ${post.desc} ${post.tags}`.toLowerCase().includes(normalized))
    : posts;

  results.innerHTML = matched.length
    ? matched.map((post) => `
      <a class="search-result" href="${post.url}">
        <strong>${post.title}</strong>
        <span>${post.desc}</span>
      </a>
    `).join("")
    : "<p class=\"hero-copy\">没有搜到，换个关键词试试。</p>";
}

function openSearch() {
  if (!modal || !searchInput) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  renderResults("");
  window.setTimeout(() => searchInput.focus(), 30);
}

function closeSearch() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll("[data-search-open]").forEach((button) => {
  button.addEventListener("click", openSearch);
});

document.querySelectorAll("[data-search-close]").forEach((button) => {
  button.addEventListener("click", closeSearch);
});

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeSearch();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", (event) => renderResults(event.target.value));
}

window.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openSearch();
  }
  if (event.key === "Escape") {
    closeSearch();
  }
});
