let lang = localStorage.getItem("lang") || CONFIG.defaultLang;
let theme = localStorage.getItem("theme") || CONFIG.defaultTheme;

const body = document.body;
const buttonsWrap = document.getElementById("buttons");

function applyTheme() {
  body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
}

function render() {
  const data = CONFIG.text[lang];
  document.getElementById("title").textContent = data.title;
  document.getElementById("subtitle").textContent = data.subtitle;
  document.getElementById("copyright").textContent = data.copyright;

  buttonsWrap.innerHTML = "";
  data.buttons.forEach(btn => {
    const el = document.createElement("button");
    el.className = "menu-btn";
    el.innerHTML = `<i class="fa-brands ${btn.icon}"></i>${btn.label}`;
    el.onclick = () => {
      el.classList.add("active");
      setTimeout(() => window.open(btn.link, "_blank"), 300);
    };
    buttonsWrap.appendChild(el);
  });
}

document.getElementById("themeToggle").onclick = () => {
  theme = theme === "light" ? "dark" : "light";
  applyTheme();
};

document.getElementById("langToggle").onclick = (e) => {
  lang = lang === "id" ? "en" : "id";
  e.target.textContent = lang.toUpperCase();
  localStorage.setItem("lang", lang);
  render();
};

applyTheme();
render();