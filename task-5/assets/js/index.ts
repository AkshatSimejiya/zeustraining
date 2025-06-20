// Define types for the objects
interface Announcement {
    name: string;
    announcement: string;
    attachments: string | null;
    course: string | null;
    date: string;
    status: boolean;
}

interface Alert {
    alert: string;
    course: string | null;
    date: string;
    status: boolean;
}

interface CardData {
    title: string;
    subject: string;
    grade: string;
    gradeIncrement: string;
    units: number;
    lessons: number;
    topics: number;
    professorOptions: string[];
    students: number;
    dateRange: string;
    imageSrc: string;
    isFavorite: boolean;
    actionsEnabled: boolean;
    expired: boolean;
}

// Define the sample data (as provided)
const announcements: Announcement[] = [
    {
        name: "Wilson Kumar",
        announcement: "No classes will be held on 21st Nov",
        attachments: "2 files are attached",
        course: null,
        date: "15-Sep-2018 at 07:21 pm",
        status: true
    },
    {
        name: "Samson White",
        announcement: "Guest lecture on Geometry on 20th September",
        attachments: "2 files are attached",
        course: null,
        date: "15-Sep-2018 at 07:21 pm",
        status: false
    },
    {
        name: "Wilson Kumar",
        announcement: "Additional course materials available on request",
        attachments: null,
        course: "Mathematics 101",
        date: "15-Sep-2018 at 07:21 pm",
        status: true
    },
    {
        name: "Wilson Kumar",
        announcement: "No classes will be held on 25th Dec",
        attachments: null,
        course: null,
        date: "15-Sep-2018 at 07:21 pm",
        status: false
    },
    {
        name: "Wilson Kumar",
        announcement: "Additional course materials available on request",
        attachments: null,
        course: "Mathematics 101",
        date: "15-Sep-2018 at 07:21 pm",
        status: false
    }
];

const alerts: Alert[] = [
    {
        alert: "License for Introduction to Algebra has been assigned to your school",
        course: null,
        date: "15-Sep-2018 at 07:21 pm",
        status: false
    },
    {
        alert: "Lesson 3 Practice Worksheet overdue for Amy Santiago",
        course: "Course: <span>Advanced Mathematics</span>",
        date: "15-Sep-2018 at 05:21 pm",
        status: true
    },
    {
        alert: "23 new students created",
        course: null,
        date: "14-Sep-2018 at 01:21 pm",
        status: false
    },
    {
        alert: "15 submissions ready for evaluation",
        course: "Class: <span>Basics of Algebra</span>",
        date: "13-Sep-2018 at 01:15 pm",
        status: false
    },
    {
        alert: "License for Basic Concepts in Geometry has been assigned to your... school",
        course: null,
        date: "15-Sep-2018 at 07:21 pm",
        status: false
    },
    {
        alert: "Lesson 3 Practice Worksheet overdue for Sam Diego",
        course: "Course: Advanced Mathematics",
        date: "15-Sep-2018 at 07:21 pm",
        status: true
    },
    {
        alert: "License for Basic Concepts in Geometry has been assigned to your... school",
        course: null,
        date: "15-Sep-2018 at 07:21 pm",
        status: false
    }
];

const passwordField = <HTMLInputElement>document.getElementById("password");
const togglePassword = document.querySelector(".password-toggle-icon img") ;
const togglePass = document.querySelector(".password-toggle-icon")
const toggleRemember = document.querySelector('.check_box')
console.log("Build using ts")

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

if(togglePass){
    togglePass.addEventListener("keydown",(event)=>{
        console.log("Key Pressed")
        const keyboardEvent = event as KeyboardEvent; 

        switch(keyboardEvent.key){
            case "ArrowDown":
                passwordField.type = "text";
                break;
            case "ArrowUp":
                passwordField.type = "password";
                break;
                
        }
    })
}

const rememberBtn = document.getElementById('rememberBtn') as HTMLInputElement;

rememberBtn.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault(); 
        rememberBtn.checked = !rememberBtn.checked; 
    }
});


const hamburger = document.querySelector('.hamburger') as HTMLElement;


if (hamburger) {
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item') as NodeListOf<HTMLElement>;
    const announcementContentDiv = document.querySelector('.announcement-div') as HTMLElement;
    const alertDiv = document.querySelector('.alert-div') as HTMLElement;
    const bellIcon = document.querySelector('.bell-icon') as HTMLElement;
    const announcementIcon = document.querySelector('.announcement-icon') as HTMLElement;
    const mobileMenu = document.querySelector('.menu-mobile') as HTMLElement;
    const dashboardContainer = document.querySelector('.dashboard-cards') as HTMLElement;

    mobileMenuItems.forEach((e) => 
        e.addEventListener('mouseover', () => {
            e.classList.add('active-menu-item');
        })
    );

    mobileMenuItems.forEach((e) =>
        e.addEventListener('mouseout', () => {
            e.classList.remove('active-menu-item');
        })
    );

    let announcementContent = ``;
    announcementContent += `<div class="announcement-container">`;
    announcements.forEach(announcement => {
        announcementContent += `
            <div class="announcement-item ${announcement.status ? '' : 'marked-done'}">
                <p class="tutor-name">PA: <span>${announcement.name}</span></p>
                <p class="course-announcement">${announcement.announcement}</p>
                ${announcement.course ? 
                    `<p class="course-extra">Course : <span>${announcement.course}</span></p>`
                    : ''}
                <div class="announcement-flex">
                    ${announcement.attachments ? `
                        <p><span><img src="./assets/icons/attach_file.svg" alt=""></span>${announcement.attachments}</p>` 
                        : `<p></p>`}
                    <p class="announcement-date">${announcement.date}</p>
                </div>
                <div class="marked ${announcement.status ? '' : 'marked-check'}">
                    ${announcement.status ? `<img src="./assets/icons/check_mark.svg" alt="">` : `<img src="./assets/icons/remove.svg" alt="">`}
                </div>
            </div>
        `;
    });
    announcementContent += `</div><div class="announcement-actions"><button>SHOW ALL</button><div class="seperator"></div><button>CREATE NEW</button></div>`;
    announcementContentDiv.innerHTML = announcementContent;

    let alertContent = '';
    alertContent += `<div class="announcement-container">`;
    alerts.forEach(alert => {
        alertContent += `
            <div class="announcement-item ${alert.status ? '' : 'marked-done'}">
                <p class="course-announcement">${alert.alert}</p>
                ${alert.course ? `<p class="course-extra">${alert.course}</p>` : ''}
                <div class="announcement-flex">
                    <p class="announcement-date">${alert.date}</p>
                </div>
                <div class="marked ${alert.status ? '' : 'marked-check'}">
                    ${alert.status ? `<img src="./assets/icons/check_mark.svg" alt="">` : `<img src="./assets/icons/remove.svg" alt="">`}
                </div>
            </div>
        `;
    });

    alertContent += `
        </div>
        <div class="announcement-actions">
            <button>SHOW ALL</button>
        </div>
    `;
    alertDiv.innerHTML = alertContent;

    bellIcon.addEventListener('mouseenter', () => {
        alertDiv.classList.add('alert-active');
    });

    bellIcon.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!alertDiv.matches(':hover')) {
                alertDiv.classList.remove('alert-active');
            }
        }, 500);
    });

    alertDiv.addEventListener('mouseleave', () => {
        alertDiv.classList.remove('alert-active');
    });

    alertDiv.addEventListener('mouseenter', () => {
        alertDiv.classList.add('alert-active');
    });

    // More interactions for announcement icon and mobile menu
    announcementIcon.addEventListener('mouseenter', () => {
        announcementContentDiv.classList.add('announcement-active');
    });

    announcementIcon.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!announcementContentDiv.matches(':hover')) {
                announcementContentDiv.classList.remove('announcement-active');
            }
        }, 500);
    });

    announcementContentDiv.addEventListener('mouseleave', () => {
        announcementContentDiv.classList.remove('announcement-active');
    });

    announcementContentDiv.addEventListener('mouseenter', () => {
        announcementContentDiv.classList.add('announcement-active');
    });

    // Mobile menu hover events
    hamburger.addEventListener('mouseenter', () => {
        mobileMenu.classList.add('menu-mobile-active');
    });

    hamburger.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (!mobileMenu.matches(':hover')) {
                mobileMenu.classList.remove('menu-mobile-active');
            }
        }, 500);
    });

    mobileMenu.addEventListener('mouseleave', () => {
        mobileMenu.classList.remove('menu-mobile-active');
    });

    mobileMenu.addEventListener('mouseenter', () => {
        mobileMenu.classList.add('menu-mobile-active');
    });

    // Fetching card data and appending it to the dashboard
    fetch('./assets/js/cardData.json')
        .then((response) => response.json())
        .then((cardData: CardData[]) => {
            cardData.forEach((data) => {
                const cardHTML = `
                    <div class="dashboard-card">
                        ${data.expired ? `<div class="ex-label"><span>EXPIRED</span></div>` : ''}
                        <div class="card-content">
                            <div class="card-image">
                                <img src="${data.imageSrc}" alt="">
                            </div>
                            <div class="card-details">
                                <h2>${data.title}</h2>
                                <div class="sub-grade">
                                    <p>${data.subject}</p>
                                    <div class="seperator"></div>
                                    <p>${data.grade}<span> ${data.gradeIncrement}</span></p> 
                                </div>
                                <div class="course-content">
                                    ${data.units > 0 ? `<p><span>${data.units}</span> Units</p>` : ''}
                                    ${data.lessons > 0 ? `<p><span>${data.lessons}</span> Lessons</p>` : ''}
                                    ${data.topics > 0 ? `<p><span>${data.topics}</span> Topics</p>` : ''}
                                </div>
                                <div class="prof-select ${data.professorOptions[0] === 'No Classes' ? 'disabled' : ''}">
                                    <select name="professor" id="profsel">
                                        ${data.professorOptions.map((option) => 
                                            `<option value="${option.toLowerCase().replace(/\s/g, '')}">${option}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                <div class="sub-grade card-stats">
                                    ${data.students > 0 ? `<p>${data.students} Students</p>` : ''}
                                    ${data.dateRange ? `<div class="seperator"></div><p>${data.dateRange}</p>` : ''}
                                </div>
                                <div class="favourite-icon">
                                    <img src="${data.isFavorite ? './assets/icons/favourite.svg' : './assets/icons/favouritegrey.svg'}" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="card-actions">
                            <div class="card-action-icon">
                                <img src="./assets/icons/preview.svg" alt="">
                            </div>
                            <div class="card-action-icon ${data.actionsEnabled ? '' : 'icon-disabled'}">
                                <img src="./assets/icons/manage course.svg" alt="">
                            </div>
                            <div class="card-action-icon ${data.actionsEnabled ? '' : 'icon-disabled'}">
                                <img src="./assets/icons/grade submissions.svg" alt="">
                            </div>
                            <div class="card-action-icon">
                                <img src="./assets/icons/reports.svg" alt="">
                            </div>
                        </div>
                    </div>
                `;
                
                // Append the card HTML to the dashboard
                dashboardContainer.innerHTML += cardHTML;
            });
        })
        .catch((error) => {
            console.error("Error fetching card data:", error);
        });
}
