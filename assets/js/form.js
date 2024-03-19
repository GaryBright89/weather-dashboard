const formContainer = $("#form-container");

function createForm() {
  //create
  const form = $('<form class="d-flex flex-column gap-2">');
  const headingEl = $("<h1>");
  const inputEl = $(
    '<input type="text" class="form-control" placeholder="Search!">'
  );
  const submitEl = $('<button type="submit" class="btn btn-success">');

  //build
  headingEl.text("Search for a City:");
  submitEl.text("Search");

  //place
  form.append(headingEl).append(inputEl).append(submitEl);
  formContainer.append(form);

  return { form, inputEl, submitEl };
}
