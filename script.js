const wrapper = document.querySelector(".wrapper");
const input = wrapper.querySelector(".input");
const infoTxt = input.querySelector(".info");
const inputTxt = input.querySelector("input");
const botaoLocalizacao = input.querySelector("button");
const icon = document.querySelector(".clima img");
const botaoVoltar = wrapper.querySelector("header i")
let api;


inputTxt.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputTxt.value != ""){
       requestApi(inputTxt.value);
    }
})

botaoLocalizacao.addEventListener("click", ()=> {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Seu navegador não suporta localiazdor.")
    }
})

function onSuccess(position) {
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${'2f9b1ef676b57b9430d9e96669622d2c'}`
    fetchData();
}

function onError(error) {
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function requestApi(cidade) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&appid=${'2f9b1ef676b57b9430d9e96669622d2c'}`;
    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Obtendo detalhes do clima...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    if (info.cod == '404') {
        infoTxt.innerText = `${inputTxt.value} não é um nome de cidade válido.`;
        infoTxt.classList.replace("pending", "error");
    } else {
        const cidade = info.name;
        const pais = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if (id == 800) {
            icon.src = "icons/clear.svg";
        } else if (id >= 200 && id <= 232) {
            icon.src = "icons/strom.svg";
        } else if (id >= 600 && id <= 622) {
            icon.src = "icons/snow.svg";
        } else if (id >= 701 && id <= 781) {
            icon.src = "icons/haze.svg";
        } else if (id >= 801 && id <= 804) {
            icon.src = "icons/cloud.svg";
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id >= 531)) {
            icon.src = "icons/rain.svg";
        }

        wrapper.querySelector(".temp .numero").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".local span").innerText = `${cidade}, ${pais}`;
        wrapper.querySelector(".temp .numero-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".umidade span").innerText = `${humidity}%`;

        infoTxt.classList.remove("pending", "error");
        wrapper.classList.add("active");
    }
}

botaoVoltar.addEventListener("click", () => {
    wrapper.classList.remove("active");
});