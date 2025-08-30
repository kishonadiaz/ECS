
// Immediately Invoked Async Function Expression (IIFE)
// Runs as soon as the script loads
(async () => {

    // Get the login form element
    let login = document.getElementById("loginform");

    // Attach "submit" event listener to the form
    login.addEventListener("submit", async (ev) => {

        // Prevent default page reload (not included but recommended)
        // ev.preventDefault();

        // Get references to form and input fields
        let form = document.querySelector("#loginform");
        let username = form.querySelector("#username");
        let password = form.querySelector("#password");

        // Simple validation: ensure username and password are not empty
        if (username.value == "") return;
        if (password.value == "") return;

        // Collect form data (though not used directly, could be useful later)
        let formdata = new FormData(form)

        // Send login request to API
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

        // Parse JSON response
        let data = logindata.json()

        // Handle login response
        data.then(thedata => {
            console.log(String(thedata.token).split("-")[1])

            // Extract userId from token (assumes token format "something-userId-something")
            let userid = String(thedata.token).split("-")[1];

            // If login request was successful (HTTP 200 OK)
            if (logindata.ok) {

                // Save token in session storage for authentication in future requests
                sessionStorage.setItem("authToken", thedata.token);
                //history.pushState(null, null, location.href); // Pushes the current page to history
                //window.onpopstate = function () {
                //    history.go(1); // Navigates forward if the user tries to go back
                //};
                location.href = `./dashboard.html?uid=${userid}`
            }

        })

        console.log(logindata)    // Fetch response object


        console.log(username)     //Input field reference
    })
})()