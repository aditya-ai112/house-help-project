// 🔐 LOGIN + REGISTER
/// REGISTER
window.register = async function(auth) {
    alert("Register clicked"); // test

    const { createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js");

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Registered Successfully"))
    .catch(e => alert(e.message));
}

// LOGIN
window.login = async function(auth) {
    alert("Login clicked"); // test

    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js");

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        if(email === "admin@gmail.com") {
            window.location = "admin.html";
        } else {
            window.location = "user.html";
        }
    })
    .catch(e => alert(e.message));
}

window.forgotPassword = async function() {

    const { sendPasswordResetEmail } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js");

    let email = document.getElementById("email").value;

    if(email === "") {
        alert("Please enter your email first");
        return;
    }

    sendPasswordResetEmail(auth, email)
    .then(() => {
        alert("Password reset email sent! Check your inbox.");
    })
    .catch(e => alert(e.message));
}
// 🛠️ ADMIN ADD HELPER
async function addHelper(db) {
    const { ref, set } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js");

    let name = document.getElementById("name").value;
    let city = document.getElementById("city").value;
    let phone = document.getElementById("phone").value;
    let location = document.getElementById("location").value;
    let service = document.getElementById("service").value;

    let id = Date.now();

    set(ref(db, "helpers/" + id), {
        name, city, phone, location, service
    });

    alert("Helper Added!");
}


// 🔍 SEARCH HELPER
async function searchHelper(db) {
    const { ref, get } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js");

    let city = document.getElementById("searchCity").value.toLowerCase();
    let service = document.getElementById("searchService").value;

    let snapshot = await get(ref(db, "helpers"));

    let data = snapshot.val();
    let output = "";

    for(let id in data) {
        let h = data[id];

        if(h.city.toLowerCase().includes(city) &&
          (service=="" || h.service==service)) {

            output += `
            <div class="card">
                <h3>${h.name}</h3>
                <p>${h.city}</p>
                <p>${h.service}</p>
                <p>${h.phone}</p>

                <a href="https://www.google.com/maps/search/?api=1&query=${h.location}" target="_blank">
                    📍 View Location
                </a>
            </div>`;
        }
    }

    document.getElementById("result").innerHTML = output || "No results found";
}