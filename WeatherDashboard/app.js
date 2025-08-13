const API_KEY = "Your_API_KEY_Here"; // 🔹 Replace with your OpenWeather API Key

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");
const weatherContainer = document.getElementById("weatherContainer");
const cityNameEl = document.getElementById("cityName");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const weatherIconEl = document.getElementById("weatherIcon");
const forecastEl = document.getElementById("forecast");
const loadingEl = document.getElementById("loading");

// Fetch weather by city
async function fetchWeather(city) {
    showLoading();
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!res.ok) throw new Error("City not found");
        const data = await res.json();

        displayCurrentWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        alert(error.message);
    } finally {
        hideLoading();
    }
}

// Fetch forecast
async function fetchForecast(lat, lon) {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await res.json();

    forecastEl.innerHTML = "";
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
        forecastEl.innerHTML += `
            <div>
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="">
                <p>${Math.round(day.main.temp)}°C</p>
            </div>
        `;
    }
}

// Display current weather
function displayCurrentWeather(data) {
    cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
    temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionEl.textContent = data.weather[0].description;
    weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherContainer.classList.remove("hidden");
}

// Fetch weather by current location
function fetchByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            () => alert("Unable to fetch location")
        );
    } else {
        alert("Geolocation is not supported");
    }
}

async function fetchWeatherByCoords(lat, lon) {
    showLoading();
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
        displayCurrentWeather(data);
        fetchForecast(lat, lon);
    } catch (error) {
        alert("Error fetching weather");
    } finally {
        hideLoading();
    }
}

function showLoading() {
    loadingEl.classList.remove("hidden");
}

function hideLoading() {
    loadingEl.classList.add("hidden");
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    if (cityInput.value) {
        fetchWeather(cityInput.value);
    } else {
        alert("Enter a city name");
    }
});

locationBtn.addEventListener("click", fetchByLocation);

