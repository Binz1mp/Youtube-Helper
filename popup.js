document.documentElement.lang = chrome.i18n.getUILanguage();
for (const element of document.querySelectorAll("[data-i18n]")) {
  element.textContent = chrome.i18n.getMessage(element.dataset.i18n) || element.textContent;
}

const shortsToggle = document.querySelector("#shorts-as-videos");
const saveStatus = document.querySelector(".save-status");
let savedShorts = true;
function setSaveStatus(key, error = false) {
  saveStatus.textContent = chrome.i18n.getMessage(key);
  saveStatus.classList.toggle("is-error", error);
}
async function loadSettings() {
  try {
    const settings = await chrome.storage.local.get({ shortsAsVideos: 1 });
    savedShorts = settings.shortsAsVideos !== 0 && settings.shortsAsVideos !== false;
    shortsToggle.checked = savedShorts;
    shortsToggle.disabled = false;
  } catch {
    setSaveStatus("popupLoadError", true);
  }
}
shortsToggle.addEventListener("change", async () => {
  const restoreFocus = document.activeElement === shortsToggle;
  shortsToggle.disabled = true;
  try {
    await chrome.storage.local.set({ shortsAsVideos: shortsToggle.checked ? 1 : 0 });
    savedShorts = shortsToggle.checked;
    setSaveStatus("popupSaved");
  } catch {
    shortsToggle.checked = savedShorts;
    setSaveStatus("popupSaveError", true);
  } finally {
    shortsToggle.disabled = false;
    if (restoreFocus) shortsToggle.focus();
  }
});
loadSettings();

const popcat = document.querySelector(".popcat");
const sound = new Audio(chrome.runtime.getURL("sfx/popcat.mp3"));
function pop() {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}
popcat.addEventListener("click", pop);
