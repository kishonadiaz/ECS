(async () => {
    let login = document.getElementById("loginform");
    login.addEventListener("submit",async (ev) => {
        let form = document.querySelector("#loginform");
        let username = form.querySelector("#username");
        let password = form.querySelector("#password");
        if (username.value == "") return;
        if (password.value == "") return;
        let formdata = new FormData(form)
        let logindata = await fetch("./api/Auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        })
        let data = logindata.json()
        data.then(thedata => {
            console.log(String(thedata.token).split("-")[1])
            let userid = String(thedata.token).split("-")[1];
            if (logindata.ok) {
                sessionStorage.setItem("authToken", thedata.token);
                //history.pushState(null, null, location.href); // Pushes the current page to history
                //window.onpopstate = function () {
                //    history.go(1); // Navigates forward if the user tries to go back
                //};
                location.href = `./dashboard.html?uid=${userid}`
            }

        })

        console.log(logindata)


        console.log(username)
    })
})()