// ------- Error message hide -----------
document.getElementById('spinners').style.display = 'none';
document.getElementById('empty-message').style.display = 'none';
document.getElementById('no-phone-msg').style.display = 'none';

/*------------------------------------------------------------------
Getting search input
------------------------------------------------------------------*/
const searchPhone = () => {
    document.getElementById('spinners').style.display = 'block';
    document.getElementById('empty-message').style.display = 'block';
        document.getElementById('no-phone-msg').style.display = 'none';
    const searchInput = document.getElementById('search-input');
    const searchInputText = searchInput.value;
    searchInput.value = ''; //Empty input field

    //Error if input field is empty
    if (searchInputText == '') {
        document.getElementById('empty-message').style.display = 'block';
        document.getElementById('no-phone-msg').style.display = 'none';
        document.getElementById('spinners').style.display = 'none';
    }
    // loading data when input field is not empty
    else {
        fetch(`https://openapi.programming-hero.com/api/phones?search=${searchInputText}`)
            .then(response => response.json())
            .then(data => showSearchResult(data.data))
            document.getElementById('empty-message').style.display = 'none';
    }
}

/*--------------------------------------------------------------------
Showing search result
--------------------------------------------------------------------*/
const showSearchResult = phones => {
    const searchResult = document.getElementById('search-result');
    searchResult.textContent = '';
    document.getElementById('single-phone').style.display = 'none';
    if (phones.length == 0) {
        document.getElementById('no-phone-msg').style.display = 'block';
        document.getElementById('spinners').style.display = 'none';
    }
    else {
        document.getElementById('no-phone-msg').style.display = 'none';
        document.getElementById('spinners').style.display = 'none';
        phones.forEach((phone, index) => {if (index < 20){
            const div = document.createElement('div');
            div.classList.add('col');
            div.innerHTML= `
                    <div class="card m-2 p-4">
                        <img src="${phone.image}" style="width: 60%" class="mx-auto" alt="...">
                        <h3 class="pt-4">${phone.phone_name}</h3>
                        <p class="fw-bolder">Brand: <span class="fw-normal">${phone.brand}</span></p>
                        <a href="#single-phone" onclick="loadPhoneDetails('${phone.slug}')" type="button" class="btn btn-outline-secondary">Details</a>
                    </div>
            `;
            searchResult.appendChild(div);
            document.getElementById('spinners').style.display = 'none';
        }})
    }
}


/*-----------------------------------------------------------------
Show single phone details
-----------------------------------------------------------------*/
const loadPhoneDetails = phoneId => {
    fetch(`https://openapi.programming-hero.com/api/phone/${phoneId}`)
        .then(res => res.json())
        .then(data => showPhoneDetails(data.data));
}

const showPhoneDetails = phone => {
    const phoneDetails = document.getElementById('single-phone');
    phoneDetails.style.display = 'block';
    phoneDetails.textContent = ' ';
    const div = document.createElement('div');
    div.classList.add('col');
    div.innerHTML = `
        <div id="details" class="card m-2 p-4">
            <h3 class="btn btn-outline-dark fs-3 fw-bolder mb-3">Phone details</h3>
            <img src="${phone.image}" style="width: 50%" class="mx-auto" alt="...">
            <h3 class="pt-4 mx-auto">${phone.name}</h3>
            <p id="release-found" class="mx-auto fw-bolder">Release date : ${phone.releaseDate}</p>
            <p id="release-not-found" class="mx-auto fw-bolder">Release date not found!</p> 

            <p class="fw-bolder fs-5">Main features</p> 
            <p>
            <span class="fw-bolder">Display size : </span><span class="fw-normal">${phone.mainFeatures.displaySize}</span><br>
            <span class="fw-bolder">Storage : </span><span class="fw-normal">${phone.mainFeatures.memory}</span><br>
            <span class="fw-bolder">Chip set : </span><span class="fw-normal">${phone.mainFeatures.chipSet}</span><br>
            <span class="fw-bolder">Sensors : </span><span id="sensor" class="fw-normal"></span><br>
            </p>
        </div>
    `; 
    phoneDetails.appendChild(div);

    //-------------- Release Date validation ----------------------------
    if (phone.releaseDate != ''){
        document.getElementById('release-found').style.display='block';
        document.getElementById('release-not-found').style.display='none';
    }
    else {
        document.getElementById('release-found').style.display='none';
        document.getElementById('release-not-found').style.display='block';
    }

    //-------------- Sensors showing by loop ----------------------------
    let text = "";
    const sensor = phone.mainFeatures.sensors;
    sensor.forEach(showSensor);

    document.getElementById("sensor").innerHTML = text;

    function showSensor(item) {
        text += " " + item + ";";
    }

    /*----------------------------------------------------------------
    Showing other feature if available
    (Example: Other feature is not available in 'iPhone 13 mini')
    ----------------------------------------------------------------*/
    if (phone.others != undefined) {
        const div = document.createElement('div')
        div.innerHTML = `
        <p class="fw-bolder fs-5">Other features</p> 
        <p>
        <span class="fw-bolder">Bluetooth : </span><span class="fw-normal">${phone.others.Bluetooth}</span><br>
        <span class="fw-bolder">GPS : </span><span class="fw-normal">${phone.others.GPS}</span><br>
        <span class="fw-bolder">NFC : </span><span class="fw-normal">${phone.others.NFC}</span><br>
        <span class="fw-bolder">Radio : </span><span class="fw-normal">${phone.others.Radio}</span><br>
        <span class="fw-bolder">USB : </span><span class="fw-normal">${phone.others.USB}</span><br>
        <span class="fw-bolder">WLAN : </span><span class="fw-normal">${phone.others.WLAN}</span><br>
    </p>
        `;
        const otherFeatures = document.getElementById('details');
        otherFeatures.appendChild(div);
    }
    else {
        const div = document.createElement('div')
        div.innerHTML = `
        <p class="fw-bolder fs-5">Other features</p> 
        <p>
        <span>No other features found</span>
        </p>
        `;
        const otherFeatures = document.getElementById('details');
        otherFeatures.appendChild(div);
    }
}

