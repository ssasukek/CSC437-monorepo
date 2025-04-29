const checkbox = document.querySelector('.dark-checkbox');
if (!checkbox) {
  console.error('darkmode.js: .dark-checkbox not found');
} else {
  checkbox.addEventListener('change', e => {
    document.body.classList.toggle('dark-mode', e.target.checked);
  });
}
