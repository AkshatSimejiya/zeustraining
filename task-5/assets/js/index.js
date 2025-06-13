// Define the sample data (as provided)
var announcements = [
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
var alerts = [
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
var passwordField = document.getElementById("password");
var togglePassword = document.querySelector(".password-toggle-icon img");
console.log("Build using ts");
if (togglePassword) {
    togglePassword.addEventListener("click", function () {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        }
        else {
            passwordField.type = "password";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
        }
    });
}
var hamburger = document.querySelector('.hamburger');
// Hamburger menu and other interactions
if (hamburger) {
    var mobileMenuItems = document.querySelectorAll('.mobile-menu-item');
    var announcementContentDiv_1 = document.querySelector('.announcement-div');
    var alertDiv_1 = document.querySelector('.alert-div');
    var bellIcon = document.querySelector('.bell-icon');
    var announcementIcon = document.querySelector('.announcement-icon');
    var mobileMenu_1 = document.querySelector('.menu-mobile');
    var dashboardContainer_1 = document.querySelector('.dashboard-cards');
    mobileMenuItems.forEach(function (e) {
        return e.addEventListener('mouseover', function () {
            e.classList.add('active-menu-item');
        });
    });
    mobileMenuItems.forEach(function (e) {
        return e.addEventListener('mouseout', function () {
            e.classList.remove('active-menu-item');
        });
    });
    var announcementContent_1 = "";
    announcementContent_1 += "<div class=\"announcement-container\">";
    announcements.forEach(function (announcement) {
        announcementContent_1 += "\n            <div class=\"announcement-item ".concat(announcement.status ? '' : 'marked-done', "\">\n                <p class=\"tutor-name\">PA: <span>").concat(announcement.name, "</span></p>\n                <p class=\"course-announcement\">").concat(announcement.announcement, "</p>\n                ").concat(announcement.course ?
            "<p class=\"course-extra\">Course : <span>".concat(announcement.course, "</span></p>")
            : '', "\n                <div class=\"announcement-flex\">\n                    ").concat(announcement.attachments ? "\n                        <p><span><img src=\"./assets/icons/attach_file.svg\" alt=\"\"></span>".concat(announcement.attachments, "</p>")
            : "<p></p>", "\n                    <p class=\"announcement-date\">").concat(announcement.date, "</p>\n                </div>\n                <div class=\"marked ").concat(announcement.status ? '' : 'marked-check', "\">\n                    ").concat(announcement.status ? "<img src=\"./assets/icons/check_mark.svg\" alt=\"\">" : "<img src=\"./assets/icons/remove.svg\" alt=\"\">", "\n                </div>\n            </div>\n        ");
    });
    announcementContent_1 += "</div><div class=\"announcement-actions\"><button>SHOW ALL</button><div class=\"seperator\"></div><button>CREATE NEW</button></div>";
    announcementContentDiv_1.innerHTML = announcementContent_1;
    var alertContent_1 = '';
    alertContent_1 += "<div class=\"announcement-container\">";
    alerts.forEach(function (alert) {
        alertContent_1 += "\n            <div class=\"announcement-item ".concat(alert.status ? '' : 'marked-done', "\">\n                <p class=\"course-announcement\">").concat(alert.alert, "</p>\n                ").concat(alert.course ? "<p class=\"course-extra\">".concat(alert.course, "</p>") : '', "\n                <div class=\"announcement-flex\">\n                    <p class=\"announcement-date\">").concat(alert.date, "</p>\n                </div>\n                <div class=\"marked ").concat(alert.status ? '' : 'marked-check', "\">\n                    ").concat(alert.status ? "<img src=\"./assets/icons/check_mark.svg\" alt=\"\">" : "<img src=\"./assets/icons/remove.svg\" alt=\"\">", "\n                </div>\n            </div>\n        ");
    });
    alertContent_1 += "\n        </div>\n        <div class=\"announcement-actions\">\n            <button>SHOW ALL</button>\n        </div>\n    ";
    alertDiv_1.innerHTML = alertContent_1;
    bellIcon.addEventListener('mouseenter', function () {
        alertDiv_1.classList.add('alert-active');
    });
    bellIcon.addEventListener('mouseleave', function () {
        setTimeout(function () {
            if (!alertDiv_1.matches(':hover')) {
                alertDiv_1.classList.remove('alert-active');
            }
        }, 500);
    });
    alertDiv_1.addEventListener('mouseleave', function () {
        alertDiv_1.classList.remove('alert-active');
    });
    alertDiv_1.addEventListener('mouseenter', function () {
        alertDiv_1.classList.add('alert-active');
    });
    // More interactions for announcement icon and mobile menu
    announcementIcon.addEventListener('mouseenter', function () {
        announcementContentDiv_1.classList.add('announcement-active');
    });
    announcementIcon.addEventListener('mouseleave', function () {
        setTimeout(function () {
            if (!announcementContentDiv_1.matches(':hover')) {
                announcementContentDiv_1.classList.remove('announcement-active');
            }
        }, 500);
    });
    announcementContentDiv_1.addEventListener('mouseleave', function () {
        announcementContentDiv_1.classList.remove('announcement-active');
    });
    announcementContentDiv_1.addEventListener('mouseenter', function () {
        announcementContentDiv_1.classList.add('announcement-active');
    });
    // Mobile menu hover events
    hamburger.addEventListener('mouseenter', function () {
        mobileMenu_1.classList.add('menu-mobile-active');
    });
    hamburger.addEventListener('mouseleave', function () {
        setTimeout(function () {
            if (!mobileMenu_1.matches(':hover')) {
                mobileMenu_1.classList.remove('menu-mobile-active');
            }
        }, 500);
    });
    mobileMenu_1.addEventListener('mouseleave', function () {
        mobileMenu_1.classList.remove('menu-mobile-active');
    });
    mobileMenu_1.addEventListener('mouseenter', function () {
        mobileMenu_1.classList.add('menu-mobile-active');
    });
    // Fetching card data and appending it to the dashboard
    fetch('./assets/js/cardData.json')
        .then(function (response) { return response.json(); })
        .then(function (cardData) {
        cardData.forEach(function (data) {
            var cardHTML = "\n                    <div class=\"dashboard-card\">\n                        ".concat(data.expired ? "<div class=\"ex-label\"><span>EXPIRED</span></div>" : '', "\n                        <div class=\"card-content\">\n                            <div class=\"card-image\">\n                                <img src=\"").concat(data.imageSrc, "\" alt=\"\">\n                            </div>\n                            <div class=\"card-details\">\n                                <h2>").concat(data.title, "</h2>\n                                <div class=\"sub-grade\">\n                                    <p>").concat(data.subject, "</p>\n                                    <div class=\"seperator\"></div>\n                                    <p>").concat(data.grade, "<span> ").concat(data.gradeIncrement, "</span></p> \n                                </div>\n                                <div class=\"course-content\">\n                                    ").concat(data.units > 0 ? "<p><span>".concat(data.units, "</span> Units</p>") : '', "\n                                    ").concat(data.lessons > 0 ? "<p><span>".concat(data.lessons, "</span> Lessons</p>") : '', "\n                                    ").concat(data.topics > 0 ? "<p><span>".concat(data.topics, "</span> Topics</p>") : '', "\n                                </div>\n                                <div class=\"prof-select ").concat(data.professorOptions[0] === 'No Classes' ? 'disabled' : '', "\">\n                                    <select name=\"professor\" id=\"profsel\">\n                                        ").concat(data.professorOptions.map(function (option) {
                return "<option value=\"".concat(option.toLowerCase().replace(/\s/g, ''), "\">").concat(option, "</option>");
            }).join(''), "\n                                    </select>\n                                </div>\n                                <div class=\"sub-grade card-stats\">\n                                    ").concat(data.students > 0 ? "<p>".concat(data.students, " Students</p>") : '', "\n                                    ").concat(data.dateRange ? "<div class=\"seperator\"></div><p>".concat(data.dateRange, "</p>") : '', "\n                                </div>\n                                <div class=\"favourite-icon\">\n                                    <img src=\"").concat(data.isFavorite ? './assets/icons/favourite.svg' : './assets/icons/favouritegrey.svg', "\" alt=\"\">\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"card-actions\">\n                            <div class=\"card-action-icon\">\n                                <img src=\"./assets/icons/preview.svg\" alt=\"\">\n                            </div>\n                            <div class=\"card-action-icon ").concat(data.actionsEnabled ? '' : 'icon-disabled', "\">\n                                <img src=\"./assets/icons/manage course.svg\" alt=\"\">\n                            </div>\n                            <div class=\"card-action-icon ").concat(data.actionsEnabled ? '' : 'icon-disabled', "\">\n                                <img src=\"./assets/icons/grade submissions.svg\" alt=\"\">\n                            </div>\n                            <div class=\"card-action-icon\">\n                                <img src=\"./assets/icons/reports.svg\" alt=\"\">\n                            </div>\n                        </div>\n                    </div>\n                ");
            // Append the card HTML to the dashboard
            dashboardContainer_1.innerHTML += cardHTML;
        });
    })
        .catch(function (error) {
        console.error("Error fetching card data:", error);
    });
}
