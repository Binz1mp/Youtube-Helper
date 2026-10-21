document.documentElement.lang = chrome.i18n.getUILanguage();
for (const element of document.querySelectorAll("[data-i18n]")) {
  element.textContent = chrome.i18n.getMessage(element.dataset.i18n) || element.textContent;
}

const settings = globalThis.youtubeHelperSettings;
const controls = [...document.querySelectorAll("[data-setting]")];
const saveStatus = document.querySelector(".save-status");
const captionSlider = document.querySelector("#caption-scale");
const captionReset = document.querySelector(".caption-reset");
const captionOutput = captionReset.querySelector("output");
const pending = new Set();
captionReset.title = chrome.i18n.getMessage("captionReset");
captionReset.setAttribute("aria-label", captionReset.title);

function setSaveStatus(key, error = false) {
  saveStatus.textContent = chrome.i18n.getMessage(key);
  saveStatus.classList.toggle("is-error", error);
}
function updateCaptionOutput() {
  captionOutput.textContent = `${captionSlider.value}%`;
  captionSlider.setAttribute("aria-valuetext", captionOutput.textContent);
}
function refresh(keys = Object.keys(settings.defaults)) {
  for (const control of controls) {
    const key = control.dataset.setting;
    if (!keys.includes(key)) continue;
    if (control.type === "checkbox") control.checked = settings.get(key) === 1;
    else control.value = String(settings.get(key));
  }
  updateCaptionOutput();
}

async function saveControl(control) {
  const key = control.dataset.setting;
  if (pending.has(key)) return;
  const value = control.type === "checkbox" ? (control.checked ? 1 : 0) : control.valueAsNumber;
  const focused = document.activeElement;
  const restoreFocus = focused === control || (control === captionSlider && focused === captionReset);
  pending.add(key);
  control.disabled = true;
  if (control === captionSlider) captionReset.disabled = true;
  try {
    await settings.set(key, value);
    setSaveStatus("popupSaved");
  } catch {
    setSaveStatus("popupSaveError", true);
  } finally {
    pending.delete(key);
    refresh([key]);
    control.disabled = false;
    if (control === captionSlider) captionReset.disabled = false;
    if (restoreFocus) focused.focus();
  }
}
for (const control of controls) control.addEventListener("change", () => saveControl(control));
captionSlider.addEventListener("input", updateCaptionOutput);
captionReset.addEventListener("click", () => {
  captionSlider.value = "100";
  updateCaptionOutput();
  saveControl(captionSlider);
});
settings.subscribe(refresh);
settings.ready.then(() => {
  refresh();
  if (!settings.available) {
    setSaveStatus("popupLoadError", true);
    return;
  }
  for (const control of controls) control.disabled = false;
  captionReset.disabled = false;
});

const popcat = document.querySelector(".popcat");
const sound = new Audio(chrome.runtime.getURL("sfx/popcat.mp3"));
function pop() {
  sound.currentTime = 0;
  sound.play().catch(() => {});
}
popcat.addEventListener("click", pop);
