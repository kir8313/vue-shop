export default {
  install(app, options) {
    const $alert = app.config.globalProperties.$alert = (html) => initAlert(html, 'success');
    const $error = app.config.globalProperties.$error = (html) => initAlert(html, 'danger');
    app.provide('$alert', $alert)
    app.provide('$error', $error)
  }
}

function initAlert(html, type) {
  const id = String(Date.now());
  if (!document.querySelector('.alerts__inner')) {
    document.body.insertAdjacentHTML('afterbegin', '<div class="alerts__inner"></div>')
  }

  document.querySelector('.alerts__inner').insertAdjacentHTML('beforeend', `
  <div class="alert alert-${type} alert-dismissible" role="alert" id="${id}">
    ${html}
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
     ></button>
  </div>`);

  const timeOut = setTimeout(() => {
    removeEl();
  }, 4000);

  document.getElementById(id).addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-close') && document.getElementById(id)) {
      removeEl();
      clearTimeout(timeOut);
    }
  })

  function removeEl () {
    document.getElementById(id).remove();
    if (document.querySelectorAll('.alert').length === 0) {
      document.querySelector('.alerts__inner').remove();
    }
  }
}
