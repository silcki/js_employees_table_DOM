'use strict';

// write code here
const header = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const th = header.getElementsByTagName('th');
const tr = tbody.getElementsByTagName('tr');
const headers = [];
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

[...th].forEach(el => {
  headers.push(el.textContent.toLowerCase());
});

// ------------ Form -----------------------

function pushNotification(title, description, type) {
  // write code here
  const messageContainer = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageParagraph = document.createElement('p');

  const previous = document.getElementsByClassName('notification');

  const posTop = previous.length > 0 ? (10 + previous.length * 140) : 10;
  const posRight = 10;

  messageContainer.classList.add('notification');
  messageContainer.classList.add(type);
  messageContainer.style.top = posTop + 'px';
  messageContainer.style.right = posRight + 'px';
  messageContainer.dataset.qa = 'notification';
  messageTitle.className = 'title';
  messageTitle.textContent = title;
  messageParagraph.textContent = description;

  messageContainer.append(messageTitle);
  messageContainer.append(messageParagraph);

  document.body.append(messageContainer);

  setTimeout(function() {
    messageContainer.remove();
  }, 2000);
}

function showForm() {
  const form = document.createElement('form');

  form.addEventListener('submit', e => {
    e.preventDefault();
  });

  form.classList.add('new-employee-form');

  // ---- Name ----
  const nameLabel = document.createElement('label');
  const nameInput = document.createElement('input');

  nameInput.dataset.qa = 'name';
  nameInput.name = 'name';
  nameInput.required = true;

  nameLabel.textContent = 'Name:';
  nameLabel.append(nameInput);
  form.append(nameLabel);

  // ---- Position ----
  const positionLabel = document.createElement('label');
  const positionInput = document.createElement('input');

  positionInput.dataset.qa = 'position';
  positionInput.name = 'position';
  positionInput.required = true;

  positionLabel.textContent = 'Position:';
  positionLabel.append(positionInput);
  form.append(positionLabel);

  // ---- Office ----
  const officeLabel = document.createElement('label');
  const officeSelect = document.createElement('select');
  const cities = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  officeSelect.dataset.qa = 'office';
  officeSelect.name = 'office';
  officeSelect.required = true;

  for (const city of cities) {
    const option = document.createElement('option');

    option.value = city;
    option.textContent = city;
    // option.selected = officeValue === city;
    officeSelect.append(option);
  }

  officeLabel.textContent = 'Office:';
  officeLabel.append(officeSelect);
  form.append(officeLabel);

  // ---- Age ----
  const ageLabel = document.createElement('label');
  const ageInput = document.createElement('input');

  ageInput.dataset.qa = 'age';
  ageInput.name = 'age';
  ageInput.required = true;
  ageInput.type = 'number';

  ageLabel.textContent = 'Age:';
  ageLabel.append(ageInput);
  form.append(ageLabel);

  // ---- Salary ----
  const salaryLabel = document.createElement('label');
  const salaryInput = document.createElement('input');

  salaryInput.dataset.qa = 'salary';
  salaryInput.name = 'salary';
  salaryInput.required = true;
  salaryInput.type = 'number';

  salaryLabel.textContent = 'Salary:';
  salaryLabel.append(salaryInput);
  form.append(salaryLabel);

  // ---- Save button ----
  const saveButton = document.createElement('button');

  saveButton.textContent = 'Save to table';
  form.append(saveButton);

  saveButton.addEventListener('click', e => {
    e.preventDefault();

    // eslint-disable-next-line no-shadow
    const name = document.querySelector('input[name=name]').value;
    const position = document.querySelector('input[name=position]').value;
    const office = document.querySelector('select[name=office]').value;
    const age = document.querySelector('input[name=age]').value;
    const salary = document.querySelector('input[name=salary]').value;

    if (name.length < 4) {
      pushNotification(
        'Error',
        'Name should not be less than 4 letters',
        'error'
      );

      return;
    }

    if (age < 18 || age > 90) {
      pushNotification(
        'Error',
        'Age from 18 until 90',
        'error'
      );

      return;
    }

    pushNotification(
      'Success',
      'The new employee was successfully added',
      'success'
    );

    data.push({
      name,
      position,
      office,
      age,
      salary,
    });

    const newRow = tbody.insertRow(tbody.rows.length);

    [...tbody.rows[0].cells].forEach((el, index) => {
      newRow.insertCell(index);
    });

    sortData(sort);
    reDrawTable();

    form.reset();
  });

  document.body.append(form);
}

showForm();

// ------------ Edit -----------------------

tbody.addEventListener('dblclick', (e) => {
  // console.log('dblclick');
  // const rowData = {};
  //
  // const td = e.target.parentElement.getElementsByTagName('td');
  //
  // [...td].forEach((cell, index) => {
  //   let value = cell.textContent;
  //
  //   switch (headers[index]) {
  //     case 'age':
  //       value = +value;
  //       break;
  //     case 'salary':
  //       value = Number(value.replace(/[^0-9.-]+/g, ''));
  //       break;
  //   }
  //
  //   rowData[headers[index]] = value;
  // });
});
// ------------ Select -----------------------

tbody.addEventListener('click', e => {
  const selected = tbody.querySelector('.active');

  if (selected) {
    selected.classList.remove('active');
  }
  e.target.parentElement.classList.add('active');
});

// ------------ Take the data -----------------------
const data = [];
let sort = 'name|desc';

[...tr].forEach((el) => {
  const td = el.getElementsByTagName('td');

  const row = {};

  data.push(row);

  [...td].forEach((cell, index) => {
    let value = cell.textContent;

    switch (headers[index]) {
      case 'age':
        value = +value;
        break;
      case 'salary':
        value = Number(value.replace(/[^0-9.-]+/g, ''));
        break;
    }

    row[headers[index]] = value;
  });
});

// ------------ Sorting -----------------------

function sortData(sorting) {
  const [field, condition] = sorting.split('|');

  let sortFunc;

  switch (field) {
    default:
      sortFunc = (a, b) => {
        return condition === 'asc'
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      };
      break;
    case 'age':
    case 'salary':
      sortFunc = (a, b) => {
        return condition === 'asc' ? a[field] - b[field] : b[field] - a[field];
      };
      break;
  }

  data.sort(sortFunc);
}

function reDrawTable() {
  [...tr].forEach((row, i) => {
    const td = row.getElementsByTagName('td');

    [...td].forEach((cell, j) => {
      switch (headers[j]) {
        default:
          cell.textContent = data[i][headers[j]];
          break;
        case 'salary':
          cell.textContent = formatter.format(data[i][headers[j]]);
          break;
      }
    });
  });
}

header.addEventListener('click', el => {
  const item = el.target.textContent.toLowerCase();
  const [field, condition] = sort.split('|');
  const newCondition = field !== item ? 'asc' : condition;

  sortData(`${item}|${newCondition}`);

  sort = `${item}|${newCondition === 'asc' ? 'desc' : 'asc'}`;

  reDrawTable();
});
