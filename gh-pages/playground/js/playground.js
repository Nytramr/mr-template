const { Template } = mrTemplate;

let templateEditor = document.getElementById('template-code');
let templateEditorErrors = document.getElementById('template-errors');
let renderEditor = document.getElementById('render-code');
let dataEditor = document.getElementById('data-code');
let dataFormat = document.getElementById('format-data');

let templateActions = document.getElementById('template-actions');

let template = new Template('My template');

function renderTemplate(templateTrees = {}) {
  let renderText = '';
  try {
    let newTemplate = template.clone();

    Object.entries(templateTrees).forEach((entry) =>
      newTemplate.addParseTree(...entry),
    );

    let data = JSON.parse(dataEditor.innerText || '');
    renderText = newTemplate.execute(data);
  } catch (error) {
    renderText = error.message;
  } finally {
    renderEditor.innerText = renderText;
  }
}

dataEditor.addEventListener('input', () =>
  renderTemplate(templateEditor.templateTrees),
);

dataFormat.addEventListener('click', () => {
  let dataObject = JSON.parse(dataEditor.innerText || '');
  let dataText = JSON.stringify(dataObject, null, 2);

  dataEditor.innerText = dataText;
});

document.addEventListener('mr-template-editor-error', (event) => {
  let errors = event.detail.errors;
  if (errors.length > 0) {
    templateEditorErrors.innerText = errors.join('\n');
  }
});

document.addEventListener('mr-template-editor-change', (event) => {
  templateEditorErrors.innerText = '';
  renderTemplate(event.target.templateTrees);
});

templateActions.addEventListener('click', (event) => {
  let target = event.target;
  if (target.classList.contains('insert-action')) {
    let { before, after } = target.dataset;

    templateEditor.surroundContents(before, after);
  }
});

// Template persistence

let saveButton = document.getElementById('save-template');
let templateName = document.getElementById('template-name');
let templateId = document.getElementById('template-id');

saveButton.addEventListener('click', () => {
  let templateText = templateEditor.innerText;
  let dataText = dataEditor.innerText;

  let url = new URL('template', location.href);
  if (templateId.value) {
    url.searchParams.set('id', templateId.value);
  }
  url.searchParams.set('name', templateName.value || 'Untitled Template');

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template: templateText,
      data: dataText,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      templateId.value = result.id || '';
      // add the id to the URL without reloading the page
      let newUrl = new URL(location.href);
      newUrl.searchParams.set('id', result.id);
      history.replaceState({}, '', newUrl.toString());
    })
    .catch((error) => {
      console.error('Error saving template:', error);
    });
});

// Load template from URL parameters if available
let urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('id')) {
  let urlTemplateId = urlParams.get('id');

  fetch(`/template?id=${urlTemplateId}`)
    .then((response) => response.json())
    .then((data) => {
      dataEditor.innerText = data.data || '';
      templateName.value = data.name || 'Untitled Template';
      templateId.value = data.id || '';
      templateEditor.setAttribute('text', data.template || '');
    })
    .catch((error) => {
      console.error('Error loading template:', error);
    });
} else {
  try {
    renderTemplate(templateEditor.templateTrees);
  } catch (error) {}
}

// Load templates from dialog
document.getElementById('load-template').addEventListener('click', async () => {
  const dialog = document.getElementById('load-template-dialog');
  const list = document.getElementById('saved-templates-list');

  const templates = await fetch('/templates')
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error fetching templates:', error);
      return [];
    });

  if (!templates || templates.length === 0) {
    list.innerHTML = '<li>No templates found</li>';
    dialog.showModal();
    return;
  }

  list.innerHTML = '';
  templates.forEach((tpl, idx) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `./?id=${tpl.id}`;
    link.textContent = tpl.name || `Template ${idx + 1}`;
    link.onclick = () => {
      dialog.close();
    };
    li.appendChild(link);
    list.appendChild(li);
  });
  dialog.showModal();
});
