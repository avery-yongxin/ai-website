const storeKey = "douyin-material-workbench-v1";

const seedState = {
  page: "dashboard",
  generating: false,
  form: {
    name: "",
    category: "",
    brand: "",
    material: "",
    color: "",
    audience: "",
    shop: "抖音旗舰店A",
    price: "",
    reference: "",
    saveAsset: true,
    templateId: ""
  },
  lastResult: null,
  templates: [
    {
      id: "tpl-bag",
      name: "通勤包主图模板",
      shop: "抖音旗舰店A",
      tags: ["女包", "通勤", "高转化"],
      title: "大容量通勤托特包｜轻盈耐磨，可装电脑",
      sellingPoints: ["一眼看清容量和材质，适合上班、出差、短途通勤。", "标题保留核心搜索词，主图突出大容量与轻量。"],
      style: "干净白底 + 红色利益点角标",
      productName: "通勤托特包"
    },
    {
      id: "tpl-sale",
      name: "大促标题结构",
      shop: "抖音店铺B",
      tags: ["大促", "标题", "爆款"],
      title: "限时到手价｜{品类}新款，家用囤货更划算",
      sellingPoints: ["先给价格理由，再给适用场景，适合直播间和短视频承接。", "卖点句控制在两行内，方便运营直接复制。"],
      style: "深色背景 + 到手价强调",
      productName: "大促商品"
    }
  ],
  assets: [
    { id: "a1", name: "白底主图-女包", type: "商品图", shop: "抖音旗舰店A", used: 14 },
    { id: "a2", name: "爆款截图-通勤场景", type: "参考图", shop: "抖音旗舰店A", used: 9 },
    { id: "a3", name: "直播间价格贴纸", type: "贴纸素材", shop: "抖音店铺B", used: 21 },
    { id: "a4", name: "服饰详情页卖点", type: "文案素材", shop: "抖音店铺C", used: 7 }
  ]
};

let state = loadState();

const pageTitles = {
  dashboard: "工作台首页",
  generator: "素材生成",
  editor: "结果编辑",
  templates: "模板库",
  assets: "素材库",
  loop: "运营报告"
};

const demoProduct = {
  name: "轻量防泼水通勤双肩包",
  category: "箱包 / 双肩包",
  brand: "北城日用",
  material: "高密度尼龙",
  color: "雾黑",
  audience: "上班族、学生、短途出差人群",
  shop: "抖音旗舰店A",
  price: "129",
  reference: "参考历史爆款：大容量、轻量、防泼水、可装15寸电脑",
  saveAsset: true,
  templateId: "tpl-bag"
};

function loadState() {
  try {
    const raw = localStorage.getItem(storeKey);
    return raw ? { ...seedState, ...JSON.parse(raw) } : structuredClone(seedState);
  } catch {
    return structuredClone(seedState);
  }
}

function persist() {
  localStorage.setItem(storeKey, JSON.stringify(state));
}

function setPage(page) {
  state.page = page;
  persist();
  render();
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function currentTemplate() {
  return state.templates.find((item) => item.id === state.form.templateId);
}

function buildResult() {
  const f = state.form;
  const template = currentTemplate();
  const materialPhrase = f.material ? `${f.material}材质` : "精选材质";
  const colorPhrase = f.color ? `${f.color}配色` : "百搭配色";
  const audience = f.audience || "日常用户";
  const baseTitle = `${f.name || "新品商品"}｜${colorPhrase} ${materialPhrase}，${audience}适用`;
  return {
    id: `result-${Date.now()}`,
    productName: f.name || "新品商品",
    shop: f.shop || "抖音旗舰店A",
    category: f.category || "电商商品",
    title: template ? `${f.name || template.productName}｜套用${template.name}，搜索词清晰` : baseTitle,
    sellingPoints: [
      `主图突出“${colorPhrase}、${materialPhrase}、高频使用场景”，适合快速上架试款。`,
      f.reference ? `参考素材已吸收：${f.reference}` : "卖点句控制在短句范围内，运营轻改后即可用于商品卡。"
    ],
    tags: [f.category || "新品", f.shop || "店铺", template ? "模板复用" : "默认生成"].filter(Boolean),
    price: f.price || "99",
    style: template ? template.style : "浅色商品底 + 红色利益点角标",
    createdAt: new Date().toLocaleString("zh-CN", { hour12: false })
  };
}

function render() {
  document.querySelector("#pageTitle").textContent = pageTitles[state.page];
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.page === state.page);
  });

  const root = document.querySelector("#pageRoot");
  const views = {
    dashboard: renderDashboard,
    generator: renderGenerator,
    editor: renderEditor,
    templates: renderTemplates,
    assets: renderAssets,
    loop: renderLoop
  };
  root.innerHTML = views[state.page]();
  bindPageEvents();
}

function renderDashboard() {
  const generated = state.lastResult ? 1 : 0;
  return `
    <section class="panel hero-panel">
      <div>
        <p class="eyebrow">素材生产中台 / 运营提效看板</p>
        <h2>把“做图写文案太费劲”和“好方案不能复用”收进一个运营工作台</h2>
        <p>面向抖音电商日常上新场景，运营可以导入商品、生成图文草稿、编辑结果、收藏模板并复用，把分散素材和历史方案沉淀成可管理的内容资产。</p>
        <div class="button-row">
          <button class="primary-btn" data-action="go-generator" type="button">进入素材生成</button>
          <button class="ghost-btn" data-action="go-loop" type="button">查看运营报告</button>
        </div>
      </div>
      <div class="hero-visual" aria-label="商品任务预览">
        ${["待生成商品 18 个", "模板可复用 6 套", "素材分散点 4 类"].map((text, index) => `
          <div class="mini-product">
            <div class="thumb" style="filter:hue-rotate(${index * 48}deg)"></div>
            <div><strong>${text}</strong><span>今日运营任务池</span></div>
          </div>`).join("")}
      </div>
    </section>

    <section class="grid cols-4" style="margin-top:16px">
      <div class="metric"><span>今日待生成</span><strong>18</strong><em>优先处理新品上架</em></div>
      <div class="metric"><span>已生成草稿</span><strong>${generated}</strong><em>本地模拟结果</em></div>
      <div class="metric"><span>模板库</span><strong>${state.templates.length}</strong><em>可直接套用</em></div>
      <div class="metric"><span>素材库</span><strong>${state.assets.length}</strong><em>集中管理</em></div>
    </section>

    <section class="panel" style="margin-top:16px">
      <h2>内容生产流程</h2>
      <div class="workflow">
        <div class="workflow-step"><b>1. 商品录入</b><p>集中填写商品信息、店铺、价格、参考卖点和素材来源。</p></div>
        <div class="workflow-step"><b>2. 素材生成</b><p>模拟输出主图草稿、标题关键词和可直接轻改的卖点文案。</p></div>
        <div class="workflow-step"><b>3. 结果编辑</b><p>运营对标题、卖点、主图风格和标签进行快速微调。</p></div>
        <div class="workflow-step"><b>4. 模板复用</b><p>把高转化组合沉淀为模板，下次上新直接套用。</p></div>
      </div>
    </section>
  `;
}

function renderGenerator() {
  const templateOptions = state.templates.map((tpl) => (
    `<option value="${tpl.id}" ${tpl.id === state.form.templateId ? "selected" : ""}>${escapeHtml(tpl.name)}</option>`
  )).join("");

  return `
    <section class="generator-layout">
      <form class="panel" id="productForm">
        <div class="template-head">
          <div>
            <p class="eyebrow">单页核心玩法</p>
            <h2>商品信息输入</h2>
          </div>
          <button class="ghost-btn" data-action="fill-demo" type="button">填入测试商品</button>
        </div>
        <div class="form-grid">
          ${inputField("商品名称", "name", "例如：轻量防泼水通勤双肩包")}
          ${inputField("类目", "category", "例如：箱包 / 双肩包")}
          ${inputField("品牌", "brand", "例如：北城日用")}
          ${inputField("材质", "material", "例如：高密度尼龙")}
          ${inputField("颜色", "color", "例如：雾黑")}
          ${inputField("适用人群", "audience", "例如：上班族、学生")}
          ${inputField("店铺", "shop", "例如：抖音旗舰店A")}
          ${inputField("价格", "price", "例如：129")}
          <label class="span-2">参考图/爆款链接/历史卖点
            <textarea name="reference" placeholder="粘贴参考信息，模拟上传历史爆款截图或参考链接">${escapeHtml(state.form.reference)}</textarea>
          </label>
          <label class="span-2">选择复用模板
            <select name="templateId">
              <option value="">系统默认生成逻辑</option>
              ${templateOptions}
            </select>
          </label>
        </div>
        <div class="upload-zone" style="margin-top:12px">
          <div><strong>商品图上传区</strong><br />当前版本模拟图片上传，生成时会自动进入素材库。</div>
        </div>
        <div class="option-strip">
          <span class="chip active">保存到素材库</span>
          <span class="chip">批量 Excel 导入入口</span>
          <span class="chip">参考爆款截图</span>
        </div>
        <div class="button-row">
          <button class="primary-btn" data-action="generate" type="button">生成素材</button>
          <button class="ghost-btn" data-action="clear-form" type="button">清空</button>
        </div>
      </form>

      <section class="panel result-area">
        <div class="template-head">
          <div>
            <p class="eyebrow">生成结果</p>
            <h2>主图草稿 + 标题 + 卖点</h2>
          </div>
          ${state.lastResult ? `<button class="ghost-btn" data-action="go-editor" type="button">编辑结果</button>` : ""}
        </div>
        ${state.generating ? renderLoading() : renderResultOrEmpty()}
      </section>
    </section>
  `;
}

function inputField(label, name, placeholder) {
  return `<label>${label}<input name="${name}" value="${escapeHtml(state.form[name])}" placeholder="${placeholder}" /></label>`;
}

function renderLoading() {
  return `
    <div class="loading-box">
      <div>
        <div class="spinner"></div>
        <h3>正在模拟真实生成过程</h3>
        <p class="small-muted">解析商品信息 → 匹配模板 → 组织标题关键词 → 生成主图卖点</p>
      </div>
    </div>
  `;
}

function renderResultOrEmpty() {
  if (!state.lastResult) {
    return `
      <div class="empty-box">
        <div>
          <h3>还没有生成结果</h3>
          <p class="small-muted">点击“填入测试商品”，再点击“生成素材”，即可快速体验内容生产链路。</p>
        </div>
      </div>
    `;
  }
  return renderResultPreview(state.lastResult, true);
}

function renderResultPreview(result, withActions = false) {
  return `
    <div class="preview-grid">
      <div class="preview-art">
        <div class="badge">抖音电商上新草稿</div>
        <div>
          <h2>${escapeHtml(result.productName)}</h2>
          <p>${escapeHtml(result.style)}</p>
        </div>
        <div class="price-tag">到手价 ¥${escapeHtml(result.price)}</div>
      </div>
      <div class="copy-block">
        <div class="copy-line"><span>商品标题</span><p>${escapeHtml(result.title)}</p></div>
        <div class="copy-line"><span>卖点文案 1</span><p>${escapeHtml(result.sellingPoints[0])}</p></div>
        <div class="copy-line"><span>卖点文案 2</span><p>${escapeHtml(result.sellingPoints[1])}</p></div>
        <div class="tag-list">${result.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        ${withActions ? `<div class="button-row"><button class="primary-btn" data-action="save-template" type="button">收藏为模板</button><button class="ghost-btn" data-action="go-editor" type="button">继续编辑</button></div>` : ""}
      </div>
    </div>
  `;
}

function renderEditor() {
  if (!state.lastResult) {
    return `
      <section class="panel empty-box">
        <div>
          <h2>暂无可编辑结果</h2>
          <p class="small-muted">先在“素材生成”页生成一条结果，再回来编辑标题、卖点和模板标签。</p>
          <button class="primary-btn" data-action="go-generator" type="button">去生成素材</button>
        </div>
      </section>
    `;
  }
  const r = state.lastResult;
  return `
    <section class="grid cols-2">
      <form class="panel" id="editForm">
        <p class="eyebrow">编辑输出</p>
        <h2>轻改后即可上架</h2>
        <div class="form-grid">
          <label class="span-2">商品标题
            <textarea name="title">${escapeHtml(r.title)}</textarea>
          </label>
          <label class="span-2">卖点文案 1
            <textarea name="point0">${escapeHtml(r.sellingPoints[0])}</textarea>
          </label>
          <label class="span-2">卖点文案 2
            <textarea name="point1">${escapeHtml(r.sellingPoints[1])}</textarea>
          </label>
          <label>主图风格
            <input name="style" value="${escapeHtml(r.style)}" />
          </label>
          <label>模板标签
            <input name="tags" value="${escapeHtml(r.tags.join('、'))}" />
          </label>
        </div>
        <div class="button-row" style="margin-top:14px">
          <button class="primary-btn" data-action="apply-edit" type="button">保存编辑</button>
          <button class="ghost-btn" data-action="save-template" type="button">收藏为模板</button>
        </div>
      </form>
      <section class="panel">
        <p class="eyebrow">实时预览</p>
        <h2>主图与文案组合</h2>
        ${renderResultPreview(r)}
      </section>
    </section>
  `;
}

function renderTemplates() {
  return `
    <section class="panel">
      <div class="template-head">
        <div>
          <p class="eyebrow">方案沉淀</p>
          <h2>模板库</h2>
        </div>
        <button class="primary-btn" data-action="go-generator" type="button">用模板生成</button>
      </div>
      <div class="filter-strip">
        <span class="chip active">全部</span>
        <span class="chip">抖音旗舰店A</span>
        <span class="chip">大促</span>
        <span class="chip">高转化</span>
      </div>
      <div class="grid cols-3">
        ${state.templates.map(renderTemplateCard).join("")}
      </div>
    </section>
  `;
}

function renderTemplateCard(tpl) {
  return `
    <article class="card template-card">
      <div class="template-head">
        <div>
          <h3>${escapeHtml(tpl.name)}</h3>
          <p>${escapeHtml(tpl.shop)}</p>
        </div>
        <button class="mini-btn" data-action="use-template" data-id="${tpl.id}" type="button">套用</button>
      </div>
      <div class="copy-line"><span>标题结构</span><p>${escapeHtml(tpl.title)}</p></div>
      <p>${escapeHtml(tpl.style)}</p>
      <div class="tag-list">${tpl.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
    </article>
  `;
}

function renderAssets() {
  return `
    <section class="panel">
      <div class="template-head">
        <div>
          <p class="eyebrow">素材集中管理</p>
          <h2>素材库</h2>
        </div>
        <button class="ghost-btn" data-action="fill-demo" type="button">补充测试素材</button>
      </div>
      <div class="asset-grid">
        ${state.assets.map((asset, index) => `
          <article class="card asset-card">
            <div class="asset-thumb" style="filter:hue-rotate(${index * 37}deg)"></div>
            <h3>${escapeHtml(asset.name)}</h3>
            <p>${escapeHtml(asset.type)} · ${escapeHtml(asset.shop)}</p>
            <span class="tag">复用 ${asset.used} 次</span>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderLoop() {
  return `
    <section class="grid">
      <div class="grid cols-4">
        <div class="metric"><span>本周生成素材</span><strong>126</strong><em>较上周 +18%</em></div>
        <div class="metric"><span>模板复用率</span><strong>42%</strong><em>通勤包模板贡献最高</em></div>
        <div class="metric"><span>平均起稿耗时</span><strong>3.8m</strong><em>比手工起稿更稳定</em></div>
        <div class="metric"><span>待优化商品</span><strong>9</strong><em>标题关键词不足</em></div>
      </div>

      <section class="panel">
        <div class="template-head">
          <div>
            <p class="eyebrow">内容效率</p>
            <h2>生成趋势</h2>
          </div>
          <span class="tag">近 7 天</span>
        </div>
        <div class="workflow">
          <div class="workflow-step"><b>周一 14 件</b><p>箱包类目集中上新，主图模板复用 5 次。</p></div>
          <div class="workflow-step"><b>周二 21 件</b><p>大促标题结构使用增加，价格利益点更突出。</p></div>
          <div class="workflow-step"><b>周三 18 件</b><p>新增参考截图 6 张，沉淀到素材库。</p></div>
          <div class="workflow-step"><b>周四 26 件</b><p>内容产能最高，编辑后保存模板 3 套。</p></div>
        </div>
      </section>

      <section class="grid cols-2">
        <article class="panel">
          <p class="eyebrow">热门模板</p>
          <h2>复用排行</h2>
          <div class="copy-block">
            <div class="copy-line"><span>1. 通勤包主图模板</span><p>复用 18 次，适合箱包、收纳、出行类商品。</p></div>
            <div class="copy-line"><span>2. 大促标题结构</span><p>复用 13 次，适合直播间承接和限时活动。</p></div>
            <div class="copy-line"><span>3. 白底利益点主图</span><p>复用 9 次，适合快速上架试款。</p></div>
          </div>
        </article>
        <article class="panel">
          <p class="eyebrow">待优化商品</p>
          <h2>运营提醒</h2>
          <div class="copy-block">
            <div class="copy-line"><span>轻量通勤双肩包</span><p>建议补充“可装 15 寸电脑”“防泼水”关键词。</p></div>
            <div class="copy-line"><span>家用收纳盒</span><p>主图卖点偏泛，建议套用“空间节省”模板。</p></div>
            <div class="copy-line"><span>夏季防晒衣</span><p>素材库缺少真人场景图，建议补充户外参考图。</p></div>
          </div>
        </article>
      </section>
    </section>
  `;
}

function bindPageEvents() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", handleAction);
  });

  const productForm = document.querySelector("#productForm");
  if (productForm) {
    productForm.addEventListener("input", () => {
      const data = new FormData(productForm);
      Object.keys(state.form).forEach((key) => {
        if (data.has(key)) state.form[key] = data.get(key);
      });
      persist();
    });
  }
}

function handleAction(event) {
  const action = event.currentTarget.dataset.action;
  const id = event.currentTarget.dataset.id;
  const routes = {
    "go-generator": "generator",
    "go-loop": "loop",
    "go-editor": "editor"
  };
  if (routes[action]) {
    setPage(routes[action]);
    return;
  }

  if (action === "fill-demo") fillDemo();
  if (action === "clear-form") clearForm();
  if (action === "generate") generateMaterial();
  if (action === "save-template") saveTemplate();
  if (action === "apply-edit") applyEdit();
  if (action === "use-template") useTemplate(id);
}

function fillDemo() {
  state.form = { ...state.form, ...demoProduct };
  if (!state.assets.some((asset) => asset.id === "demo-bag")) {
    state.assets.unshift({ id: "demo-bag", name: "测试商品图-通勤双肩包", type: "商品图", shop: demoProduct.shop, used: 1 });
  }
  persist();
  showToast("已填入测试商品，可直接生成素材");
  if (state.page !== "generator") state.page = "generator";
  render();
}

function clearForm() {
  state.form = structuredClone(seedState.form);
  state.lastResult = null;
  persist();
  showToast("已清空表单和当前结果");
  render();
}

function generateMaterial() {
  const productForm = document.querySelector("#productForm");
  if (productForm) {
    const data = new FormData(productForm);
    Object.keys(state.form).forEach((key) => {
      if (data.has(key)) state.form[key] = data.get(key);
    });
  }
  if (!state.form.name.trim()) {
    showToast("请先填写商品名称，或点击填入测试商品");
    return;
  }
  state.generating = true;
  persist();
  render();
  window.setTimeout(() => {
    state.lastResult = buildResult();
    state.generating = false;
    if (state.form.saveAsset !== false) {
      state.assets.unshift({
        id: `asset-${Date.now()}`,
        name: `生成主图-${state.form.name}`,
        type: "生成草稿",
        shop: state.form.shop,
        used: 1
      });
    }
    persist();
    showToast("已生成主图草稿、标题和卖点文案");
    render();
  }, 1200);
}

function applyEdit() {
  const form = document.querySelector("#editForm");
  if (!form || !state.lastResult) return;
  const data = new FormData(form);
  state.lastResult.title = data.get("title");
  state.lastResult.sellingPoints = [data.get("point0"), data.get("point1")];
  state.lastResult.style = data.get("style");
  state.lastResult.tags = String(data.get("tags") || "")
    .split(/[、,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
  persist();
  showToast("编辑已保存");
  render();
}

function saveTemplate() {
  if (!state.lastResult) {
    showToast("请先生成一条结果");
    return;
  }
  const tpl = {
    id: `tpl-${Date.now()}`,
    name: `${state.lastResult.productName}模板`,
    shop: state.lastResult.shop,
    tags: state.lastResult.tags,
    title: state.lastResult.title,
    sellingPoints: state.lastResult.sellingPoints,
    style: state.lastResult.style,
    productName: state.lastResult.productName
  };
  state.templates.unshift(tpl);
  persist();
  showToast("已收藏到模板库，可在下次上新时复用");
  render();
}

function useTemplate(id) {
  const tpl = state.templates.find((item) => item.id === id);
  if (!tpl) return;
  state.form.templateId = tpl.id;
  state.form.shop = tpl.shop;
  state.form.reference = `套用模板：${tpl.name}；保留风格：${tpl.style}`;
  state.page = "generator";
  persist();
  showToast("已套用模板，请填写或导入新商品");
  render();
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => setPage(item.dataset.page));
});

document.querySelector("#jumpGenerate").addEventListener("click", () => setPage("generator"));

document.querySelector("#resetDemo").addEventListener("click", () => {
  localStorage.removeItem(storeKey);
  state = structuredClone(seedState);
  showToast("演示数据已重置");
  render();
});

render();
