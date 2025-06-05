console.log("Hello World")

document.getElementById('inpForm').addEventListener('submit', function(event) {
  event.preventDefault();

  let valid = true;
  
  const name = document.getElementById('name');
  if (name.value === '') {
    alert('Please enter a valid name.');
    name.focus();
    valid = false;
    return;
  }

  const message = document.getElementById('comments');
  if (message.value === '' || message.value.length < 10) {
    alert('Please enter a message with at least 10 characters.');
    message.focus();
    valid = false;
    return;
  }

  const genderMale = document.getElementById('male').checked;
  const genderFemale = document.getElementById('female').checked;
  if (!genderMale && !genderFemale) {
    alert('Please select your gender.');
    valid = false;
    return;
  }


  if (valid) {
    alert('Form submitted successfully!');
    document.getElementById("inpForm").reset()
  }
});