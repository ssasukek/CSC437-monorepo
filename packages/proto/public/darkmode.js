const label = document.getElementById("darkmode-toggle");
label.onchange = (evt) => {
    evt.stopProgration();
    const detail = { enabled: evt.target.checked };
    const darkEvt = new CustomEvent("darkmode:toggle", { detail });
    label.dispatchEvent(darkEvt);
};

document.body.addEventListener("darkmode:toggle", (evt) => {
    if (evt.detail.enabled) {
    document.body.classList.add("dark-mode");
    } else {
    document.body.classList.remove("dark-mode");
    }
});
