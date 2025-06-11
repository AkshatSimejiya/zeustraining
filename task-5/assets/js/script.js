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

const hamburger = document.querySelector('.hamburger')

const announcements = [
    {
        "name" : "Wilson Kumar",
        "announcement" : "No classes will be held on 21st Nov",
        "attachments" : "2 files are attached",
        "course" : null,
        "date" : "15-Sep-2018 at 07:21 pm",
        "status" : true
    },
    {
        "name" : "Samson White",
        "announcement" : "Guest lecture on Geometry on 20th September",
        "attachments" : "2 files are attached",
        "course" : null,
        "date" : "15-Sep-2018 at 07:21 pm",
        "status" : false
    },
    {
        "name" : "Wilson Kumar",
        "announcement" : "Additional course materials available on request",
        "attachments" : null,
        "course" : "Course: Mathematics 101",
        "date" : "Course: Mathematics 101",
        "status" : true
    },
    {
        "name" : "Wilson Kumar",
        "announcement" : "No classes will be held on 25th Dec",
        "attachments" : null,
        "course" : null,
        "date" : "15-Sep-2018 at 07:21 pm",
        "status" : false
    },
    {
        "name" : "Wilson Kumar",
        "announcement" : "Additional course materials available on request",
        "attachments" : null,
        "course" : "Course: Mathematics 101",
        "date" : "15-Sep-2018 at 07:21 pm",
        "status" : false
    },
]

if(hamburger){
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item')


    mobileMenuItems.forEach(e => e.addEventListener('mouseover', () => {
        e.classList.add('active-menu-item');
        e.childNodes[1].childNodes[1].src = './assets/icons/keyboard_arrow_up_24dp_1F7A54_FILL0_wght400_GRAD0_opsz24.svg'
    }))

    mobileMenuItems.forEach(e => e.addEventListener('mouseout', () => {
        e.classList.remove('active-menu-item');
        e.childNodes[1].childNodes[1].src = './assets/icons/keyboard_arrow_down_24dp_1F7A54_FILL0_wght400_GRAD0_opsz24.svg'
    }))

    
    let announcementContent = ``;
    const announcementContentDiv = document.querySelector('.announcement-div') 

    announcementContent += `<div class="announcement-container">`;
    announcements.forEach(announcement => {

        announcementContent += `
            <div class="announcement-item ${announcement.status ? '' : 'marked-done'}">
                <p class="tutor-name">PA: <span>${announcement.name}</span></p>

                <p class="course-announcement">${announcement.announcement}</p>

                <p class="course-extra">${announcement.course ? `${announcement.course}` : ' '}</p>

                <div class="announcement-flex">
                    ${announcement.attachments ? `
                        <p><span><img src="./assets/icons/attach_file.svg" alt=""></span>${announcement.attachments}</p>`
                        : `<p></p>` 
                    }
                    

                    <p class="announcement-date">15-Sep-2018 at 07:21 pm</p>
                    </div>

                <div class="marked ${announcement.status ? '' : 'marked-check'}">
                    ${announcement.status ? `<img src="./assets/icons/check_mark.svg" alt="">`:`<img src="./assets/icons/remove.svg" alt="">`}
                </div>
            </div>
        `
    })
    announcementContent += `</div>
            <div class="announcement-actions">
                <button>SHOW ALL</button>
                <div class="seperator"></div>
                <button>CREATE NEW</button>
            </div>
    `
    announcementContentDiv.innerHTML = announcementContent

    // const announcementIcon = document.querySelector('.announcement-icon');

    // announcementIcon.addEventListener('mouseover', ()=>{
    //     console.log("Mouse Enter")
    //     announcementContentDiv.classList.add('announcement-active')
    // })

    // announcementIcon.addEventListener('mouseout', ()=>{
    //     console.log("Mouse Out")
    //     setTimeout(()=>{
    //         announcementContentDiv.classList.remove('announcement-active')
    //     }, 2000)
        
    // })
}