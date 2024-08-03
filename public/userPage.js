window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const inputName = urlParams.get("name");
    const img = document.querySelector('.user-image');
    const dataListElement = document.querySelector(".data-container");
    let userDataObject;
    let userCredentialObject;

    // Fetch data from API
    fetch("/api/userdata")
        .then((response) => response.json())
        .then((data) => {

            data.forEach((item) => {
                if (item.username == inputName) {
                    userDataObject = item;
                    fillUserData(userDataObject);
                }
            });
        })
        .catch((error) => console.error("Error fetching data:", error));

    // Fetch credentials from API
    fetch("/api/usercredentials")
        .then((response) => response.json())
        .then((data) => {

            data.forEach((item) => {
                if (item.username == inputName) {
                    userCredentialObject = item;
                    setPasswordLink(userCredentialObject);
                }
            });
        })
        .catch((error) => console.error("Error fetching credentials:", error));


    // Function to show this fetched data on the page
    function fillUserData(userDataObject) {
        // Adding Image url to the Image tag
        img.src = userDataObject.image;

        // Adding user data to the dataListElement
        const keys = ['Name', 'City', 'Nick Name', 'Education', 'Hobby', 'Aim', 'Favorite Movie', 'Favorite Game', 'Favorite Song', 'Favorite Food'];
        const values = [userDataObject.Name, userDataObject.City, userDataObject.Nickname, userDataObject.Education, userDataObject.Hobby, userDataObject.Aim, userDataObject.FavMovie, userDataObject.FavGame, userDataObject.FavSong, userDataObject.FavFood];
        keys.forEach((key, index) => {
            const p = document.createElement("p");
            p.innerHTML = `<strong>${key}:</strong> ${values[index]}`;
            dataListElement.appendChild(p);
        });
    }

    // Set the link according to current user
    function setPasswordLink() {
        const passChangeLink = document.querySelector(".main--change-password");
        passChangeLink.href = `/change_user_password?user=${userCredentialObject.username}`;
    }
};
