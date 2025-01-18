import CONFIG from './config.js';
import weatherCategories from './data.js';

const WEATHER_API_KEY = CONFIG.WEATHER_API_KEY;
const WEATHER_BASE_URL = CONFIG.WEATHER_BASE_URL;
const IPINFO_ACCESS_TOKEN = CONFIG.IPINFO_ACCESS_TOKEN;
const IPINFO_API_URL = CONFIG.IPINFO_API_URL;

const getWeatherCondition = (weatherCode) => {
  const conditions = {
    800: "Van Videos Categorised/800_Clear_clear sky",
    801: "Van Videos Categorised/801_Clouds_few clouds 11 - 25",
    802: "Van Videos Categorised/802_Clouds_scattered clouds 25-50",
    803: "Van Videos Categorised/803_Clouds_broken clouds 51-84",
    804: "Van Videos Categorised/804_Clouds_overcast clouds 85-100",
    200: "Van Videos Categorised/200_Thunderstorm_thunderstorm with light rain",
    202: "Van Videos Categorised/202_Thunderstorm_thunderstorm with heavy rain",
    230: "Van Videos Categorised/230_Thunderstorm_thunderstorm with light drizzle",
    300: "Van Videos Categorised/300_Drizzle_light intensity drizzle",
    301: "Van Videos Categorised/301_Drizzle_drizzle",
    500: "Van Videos Categorised/500_Rain_light rain",
    501: "Van Videos Categorised/501_Rain_moderate rain",
    502: "Van Videos Categorised/502_Rain_heavy intensity rain",
    503: "Van Videos Categorised/503_Rain_very heavy rain",
    521: "Van Videos Categorised/521_Rain_shower rain",
    600: "Van Videos Categorised/600_Snow_light snow",
    601: "Van Videos Categorised/601_Snow_snow",
    602: "Van Videos Categorised/602_Snow_heavy snow",
    622: "Van Videos Categorised/622_Snow_heavy shower snow",
    701: "Van Videos Categorised/701_Mist_mist",
    721: "Van Videos Categorised/721_Haze_haze",
    741: "Van Videos Categorised/741_Fog_fog",
    771: "Van Videos Categorised/771_Squall_squalls",
  };
  return conditions[weatherCode] || "Unknown weather condition";
};

const getWeatherData = async (lat, lon, city, timeIndex = 0) => {
  try {
    const response = await fetch(`${WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
    if (!response.ok) throw new Error(`Error fetching weather data: ${response.statusText}`);

    const data = await response.json();

    const weatherCode = data.list[timeIndex].weather[0].id;
    const weatherDesc = data.list[timeIndex].weather[0].main;
    const weatherDescription = getWeatherCondition(weatherCode);
    const temperature = Math.round(data.list[timeIndex].main.temp);
    const fullTime = data.list[timeIndex].dt_txt;
    const formattedTime = extractTime(fullTime);

    const videoSource = await getRandomVideoSource(weatherDescription);

    updateUI(videoSource, temperature, formattedTime, weatherDesc, city);
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
};

const extractTime = (apiTime) => {
  const [date, time] = apiTime.split(" ");
  return time.slice(0, 5);
};

const getRandomVideoSource = async (weatherDescription) => {
  try {
    const trimmedDescription = weatherDescription.split('/').pop();

    if (!weatherCategories[trimmedDescription] || weatherCategories[trimmedDescription].length === 0) {
      throw new Error(`No videos available for weather condition: ${trimmedDescription}`);
    }

    const videos = weatherCategories[trimmedDescription];
    const randomIndex = Math.floor(Math.random() * videos.length);

    document.getElementById("image-label").textContent = videos[randomIndex].slice(5, -4).split(" - ").pop();

    return `${weatherDescription}/${videos[randomIndex]}`;
  } catch (error) {
    console.error("Failed to get random video source:", error);
    return "default-video.mp4";
  }
};

const updateUI = (videoSource, temperature, formattedTime, weatherDesc, city) => {
  const videoSourceElement = document.getElementById("video-source");
  videoSourceElement.src = videoSource;

  const videoElement = document.querySelector("video");
  videoElement.load();

  document.getElementById("temperature").textContent = `${temperature}°`;
  document.getElementById("time").textContent = formattedTime;
  document.getElementById("location").textContent = `${weatherDesc}, ${city}`;
};

const getLocationFromIP = async () => {
  try {
    const locationResponse = await fetch(`${IPINFO_API_URL}?token=${IPINFO_ACCESS_TOKEN}`);
    const locationData = await locationResponse.json();
    const loc = locationData.loc;

    if (!loc) throw new Error('IPInfo did not return location coordinates.');

    const [latitude, longitude] = loc.split(',');

    return { latitude, longitude, city: locationData.city };
  } catch (error) {
    console.error("Failed to fetch location from IP:", error);
    return null;
  }
};

const initializeTimeBar = () => {
  const timeBar = document.getElementById('time-bar');

  for (let i = 0; i < 31; i++) {
    const line = document.createElement('div');

    if (i == 15) {
      line.classList.add('big-line');
    } else if (i == 14 || i == 16) {
      line.classList.add('medium-line');
    }

    line.classList.add('line');

    const hourContainer = document.createElement('div');
    hourContainer.style.width = '20px';
    hourContainer.style.position = 'relative';
    hourContainer.style.display = 'flex';
    hourContainer.style.flexDirection = 'column';
    hourContainer.style.alignItems = 'center';

    hourContainer.appendChild(line);
    timeBar.appendChild(hourContainer);
  }

  timeBar.addEventListener('input', async (event) => {
    const timeIndex = parseInt(event.target.value, 10) || 0;
    const location = await getLocationFromIP();
    if (location) {
      const { latitude, longitude, city } = location;
      await getWeatherData(latitude, longitude, city, timeIndex);
    } else {
      console.error("Could not determine location.");
    }
  });
};

const mainFunction = async () => {
  const location = await getLocationFromIP();
  if (location) {
    const { latitude, longitude, city } = location;
    await getWeatherData(latitude, longitude, city);
  } else {
    console.error("Could not determine location.");
  }
};

window.onload = async () => {
  await mainFunction();
  initializeTimeBar();
};
