const password = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const message = document.getElementById("message");
const showBtn = document.getElementById("showBtn");

const judgments = [
    "Did your cat type this? 🐱",
    "Hackers are already inside. 💀",
    "I've seen worse. 😐",
    "Acceptable, I guess. 🙄",
    "NSA-approved. Relax. 😎"
];

const colors = [
    "red",
    "orange",
    "yellow",
    "limegreen",
    "cyan",
    "hotpink",
    "purple"
];

password.addEventListener("input", () => {

    let val = password.value;
    let score = 0;

    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const width = (score / 4) * 100;
    strengthBar.style.width = width + "%";

    strengthBar.style.background =
        colors[Math.floor(Math.random() * colors.length)];

    message.textContent = judgments[score];

    if (score <= 1) {
        password.classList.add("shake");
    } else {
        password.classList.remove("shake");
    }
});

showBtn.addEventListener("click", () => {

    const fakePasswords = [
        "password123",
        "ilovepizza",
        "adminadmin",
        "12345678"
    ];

    const original = password.value;

    password.type = "text";
    password.value =
        fakePasswords[Math.floor(Math.random() * fakePasswords.length)];

    setTimeout(() => {
        password.value = original;
    }, 1000);
});