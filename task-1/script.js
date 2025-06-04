console.log("Hello World")

document.getElementById('inpForm').addEventListener('submit', function(event) {
  event.preventDefault();

  let valid = true;
  
  const name = document.getElementById('name').value;
  if (name === '') {
    alert('Please enter a valid name.');

    valid = false;
  }

  const message = document.getElementById('comments').value;
  if (message === '' || message.length < 10) {
    alert('Please enter a message with at least 10 characters.');
    valid = false;
  }

  const genderMale = document.getElementById('male').checked;
  const genderFemale = document.getElementById('female').checked;
  if (!genderMale && !genderFemale) {
    alert('Please select your gender.');
    valid = false;
  }


  if (valid) {
    alert('Form submitted successfully!');
  }
});