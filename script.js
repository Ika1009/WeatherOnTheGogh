import CONFIG from './config.js';
import weatherCategories from './data.js';

const WEATHER_API_KEY = CONFIG.WEATHER_API_KEY;
const WEATHER_BASE_URL = CONFIG.WEATHER_BASE_URL;

const getWeatherCondition = (weatherCode) => {
  const conditions = {
    800: "Van Videos Categorised/800_Clear_clear sky",
    801: "Van Videos Categorised/801_Clouds_few clouds",
    802: "Van Videos Categorised/802_Clouds_scattered clouds",
    803: "Van Videos Categorised/803_Clouds_broken clouds",
    804: "Van Videos Categorised/804_Clouds_overcast clouds",
    200: "Van Videos Categorised/200_Thunderstorm_thunderstorm with light rain",
    300: "Van Videos Categorised/300_Drizzle_light drizzle",
    500: "Van Videos Categorised/500_Rain_light rain",
    600: "Van Videos Categorised/600_Snow_light snow",
    701: "Van Videos Categorised/701_Mist_mist",
  };
  return conditions[weatherCode] || "Unknown weather condition";
};

const getWeatherData = async (lat, lon, city) => {
  try {
    const response = await fetch(`${WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
    if (!response.ok) throw new Error(`Error fetching weather data: ${response.statusText}`);
    
    const data = await response.json();
    const sunsetTime = new Date(data.city.sunset * 1000).getHours();
    const currentTime = new Date().getHours();
    
    let timeOfDay;
    if (currentTime < sunsetTime - 1) {
      timeOfDay = "Day";
    } else if (currentTime >= sunsetTime - 1 && currentTime <= sunsetTime + 1) {
      timeOfDay = "Sunset";
    } else {
      timeOfDay = "Night";
    }
    
    const weatherCode = data.list[0].weather[0].id;
    const weatherDescription = getWeatherCondition(weatherCode);
    
    const videoSource = await getRandomVideoSource(weatherDescription, timeOfDay);
    updateUI(videoSource, city, timeOfDay);
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
};

const getRandomVideoSource = async (weatherDescription, timeOfDay) => {
  try {
    const category = `${weatherDescription}_${timeOfDay}`;
    
    if (!weatherCategories[category] || weatherCategories[category].length === 0) {
      throw new Error(`No videos available for ${category}`);
    }
    
    const videos = weatherCategories[category];
    const randomIndex = Math.floor(Math.random() * videos.length);
    return `${weatherDescription}/${videos[randomIndex]}`;
  } catch (error) {
    console.error("Failed to get random video source:", error);
    return "default-video.mp4";
  }
};

const updateUI = (videoSource, city, timeOfDay) => {
  const videoElement = document.querySelector("video");
  const videoSourceElement = document.getElementById("video-source");
  const locationElement = document.getElementById("location");
  
  videoElement.classList.remove("show");
  
  setTimeout(() => {
    videoSourceElement.src = videoSource;
    videoElement.load();
    locationElement.textContent = `${city} - ${timeOfDay}`;
    videoElement.classList.add("show");
  }, 700);
};

const getLocationFromBrowser = async () => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          resolve({ latitude, longitude, city: data.city });
        } catch (error) {
          console.error("Error fetching location data", error);
          resolve(null);
        }
      },
      () => {
        console.error("Unable to retrieve your location");
        resolve(null);
      }
    );
  });
};

const mainFunction = async () => {
  const location = await getLocationFromBrowser();
  if (location) {
    const { latitude, longitude, city } = location;
    await getWeatherData(latitude, longitude, city);
  } else {
    console.error("Could not determine location.");
  }
};

window.onload = mainFunction;
