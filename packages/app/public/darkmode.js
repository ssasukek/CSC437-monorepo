function relayDarkToggle(e){
  e.stopPropagation();
  const checked = e.target.checked;
  const toggleEvent = new CustomEvent('darkmode:toggle', { detail:{checked}});
  e.currentTarget.dispatchEvent(toggleEvent);
}

const checkbox = document.querySelector('.dark-checkbox');
if (!checkbox) {
  console.error('darkmode.js: .dark-checkbox not found');
} else {
  checkbox.addEventListener('change', e => {
    const on = e.target.checked;
    console.log('dark mode:', on);
    document.body.classList.toggle('dark-mode', on);
  });
}

document.body.addEventListener('darkmode:toggle', evt => {
  document.body.classList.toggle('dark-mode', evt.detail.checked);
});
