function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

const today = new Date().toLocaleDateString();

chrome.storage.local.get(null, (data) => {
  const analytics = document.getElementById("analytics");
  const todayData = Object.entries(data).filter(([key]) => key.endsWith(`__${today}`));
  const total = todayData.reduce((sum, [_, val]) => sum + val, 0);
  todayData.forEach(([key, time]) => {
    const domain = key.split("__")[0];
    const percent = ((time / total) * 100).toFixed(1);
    const siteElem = document.createElement("div");
    siteElem.className = "site";
    siteElem.innerHTML = `
      <strong>${domain}</strong>: ${formatTime(time)} (${percent}%)
      <div class="bar" style="width:${percent}%;"></div>
    `;
    analytics.appendChild(siteElem);
  });
});

document.getElementById("reset").onclick = () => {
  chrome.storage.local.clear(() => {
    location.reload();
  });
};

document.getElementById("toggle-theme").onclick = () => {
  document.body.classList.toggle("dark-mode");
  const btn = document.getElementById("toggle-theme");
  btn.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
};