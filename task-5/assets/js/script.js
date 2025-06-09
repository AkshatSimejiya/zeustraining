const passwordField = document.getElementById("password");
const togglePassword = document.querySelector(".password-toggle-icon img");

if(togglePassword){
    togglePassword.addEventListener("click", function () {
    if (passwordField.type === "password") {
        passwordField.type = "text";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    }
    });
}


if(document.getElementById('hamburger-menu')){
    const hamburger = document.getElementById('hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-links');

    hamburger.addEventListener('click', ()=>{
        console.log("Clicked");
        mobileMenu.classList.toggle("active-mobile")
    })
}