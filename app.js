// 🔐 REGISTER
window.register = async function() {

    const { createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js");
    const { ref, set } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js");

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    if(!email || !password){
        alert("Enter email and password");
        return;
    }

    try {
        let userCred = await createUserWithEmailAndPassword(window.auth, email, password);

        await set(ref(window.db, "users/" + userCred.user.uid), {
            email: email,
            role: role
        });

        alert("Registered Successfully");

    } catch(e) {
        alert(e.message);
    }
}


// 🔐 LOGIN
window.login = async function() {

    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js");
    const { get, ref } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js");

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if(!email || !password){
        alert("Enter email and password");
        return;
    }

    try {
        let userCred = await signInWithEmailAndPassword(window.auth, email, password);

        let snapshot = await get(ref(window.db, "users/" + userCred.user.uid));
        let userData = snapshot.val();

        if(email === "admin@gmail.com") {
            window.location = "admin.html";
        }
        else if(userData && userData.role === "helper") {
            window.location = "helper.html";
        }
        else {
            window.location = "user.html";
        }

    } catch(e) {
        alert(e.message);
    }
}


// 🛠️ ADD HELPER
window.addHelper = async function() {

    const { ref, set } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js");

    let user = window.auth.currentUser;

    if(!user){
        alert("Login first");
        return;
    }

    let name = document.getElementById("name").value;
    let city = document.getElementById("city").value;
    let phone = document.getElementById("phone").value;
    let location = document.getElementById("location").value;
    let service = document.getElementById("service").value;

    // 🔥 UID use कर (IMPORTANT)
    await set(ref(window.db, "helpers/" + user.uid), {
        name: name,
        city: city,
        phone: phone,
        location: location,
        service: service
    });

    alert("Profile Saved Successfully!");
}


// 🔍 SEARCH
window.searchHelper = async function() {

    const { ref, get } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js");

    let city = document.getElementById("searchCity").value.toLowerCase();
    let service = document.getElementById("searchService").value;

    let snapshot = await get(ref(window.db, "helpers"));

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
                <p class="info">📞 <a href="tel:${h.phone}">${h.phone}</a></p>

                <a href="https://www.google.com/maps/search/?api=1&query=${h.location}" target="_blank">
                    📍 View Location
                </a>
            </div>`;
        }
    }

    document.getElementById("result").innerHTML = output || "No results found";
}

window.sendRequest = async function() {

    const { ref, push } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js");

    let address = document.getElementById("clientAddress").value;
    let service = document.getElementById("searchService").value;
    let phone = document.getElementById("phone").value;

    

    await push(ref(window.db, "requests"), {
        address: address,
        service: service,
        phone: phone
    });

    alert("Request Sent Successfully!");
}
window.loadRequests = async function() {

    const { ref, get } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js");

    let snapshot = await get(ref(window.db, "requests"));

    let data = snapshot.val();

    if(!data){
        document.getElementById("requests").innerHTML = "No requests found";
        return;
    }

    let output = "";

    for(let id in data) {
        let r = data[id];

        output += `
        <div class="card">
            <h3> Address: ${r.address}</h3>
            <p> Service Type: ${r.service}</p>
            <p> PhoneNo: <a href="tel:${r.phone}">${r.phone}</a></p>

            <a href="https://www.google.com/maps/search/?api=1&query=${r.address}" target="_blank">
                Open Map
            </a>
        </div>
        `;
    }

    document.getElementById("requests").innerHTML = output;
}
window.checkHelperProfile = async function() {

    const { ref, get } = await import("https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js");

    let user = window.auth.currentUser;

    if(!user) return;

    let snapshot = await get(ref(window.db, "helpers/" + user.uid));

    if(snapshot.exists()) {
        // 👉 profile already आहे
        document.getElementById("profileSection").style.display = "none";
        document.getElementById("requestSection").style.display = "block";
    } else {
        // 👉 profile नाही
        document.getElementById("profileSection").style.display = "block";
        document.getElementById("requestSection").style.display = "none";
    }
}