import CONFIG from './config.js';
import weatherCategories from './data.js';

const WEATHER_API_KEY = CONFIG.WEATHER_API_KEY;
const WEATHER_BASE_URL = CONFIG.WEATHER_BASE_URL;

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

let hours;
let data;
let location;

const getWeatherData = async (lat, lon, city, timeIndex = 0) => {
  try {
    const response = await fetch(
      `${WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );
    if (!response.ok)
      throw new Error(`Error fetching weather data: ${response.statusText}`);

    data = await response.json();
    const sunsetTime = new Date(data.city.sunset * 1000).getHours();
    const weatherCode = data.list[timeIndex].weather[0].id;
    const weatherDesc = data.list[timeIndex].weather[0].main;
    const weatherDescription = getWeatherCondition(weatherCode);
    const temperature = Math.round(data.list[timeIndex].main.temp);
    const formattedTime = extractTime();

    const videoSource = await getRandomVideoSource(weatherDescription, sunsetTime);
    updateUI(videoSource, temperature, formattedTime, weatherDesc, city);
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
};

const extractTime = () => {
  const now = new Date();
  if (hours === undefined) {
    hours = String(now.getHours()).padStart(2, '0');
  } else {
    hours = String(hours).padStart(2, '0');
  }
  return `${hours}:00`;
};

const getRandomVideoSource = async (weatherDescription, sunsetTime) => {
  try {
    const trimmedDescription = weatherDescription.split('/').pop();
    const timeOfDay = (window.getTimeOfDay || getTimeOfDay)(sunsetTime);

    if (!weatherCategories[trimmedDescription] || weatherCategories[trimmedDescription].length === 0) {
      throw new Error(`No videos available for weather condition: ${trimmedDescription}`);
    }

    let videos = weatherCategories[trimmedDescription];
    let matchingVideos = videos.filter(video => {
      const segments = video.split(" - ");
      return segments.length > 1 && segments[1].trim() === timeOfDay;
    });

    if (matchingVideos.length > 0) {
      const randomIndex = Math.floor(Math.random() * matchingVideos.length);
      document.getElementById("image-label").textContent =
        matchingVideos[randomIndex].slice(5, -4).split(" - ").pop();
      return `${weatherDescription}/${matchingVideos[randomIndex]}`;
    } else {
      const currentCode = parseInt(trimmedDescription.split('_')[0], 10);
      const allKeys = Object.keys(weatherCategories);
      const otherKeys = allKeys.filter(key => key !== trimmedDescription);

      otherKeys.sort((a, b) => {
        const codeA = parseInt(a.split('_')[0], 10);
        const codeB = parseInt(b.split('_')[0], 10);
        return Math.abs(codeA - currentCode) - Math.abs(codeB - currentCode);
      });

      for (const key of otherKeys) {
        const folderVideos = weatherCategories[key];
        const matchingFolderVideos = folderVideos.filter(video => {
          const segments = video.split(" - ");
          return segments.length > 1 && segments[1].trim() === timeOfDay;
        });
        if (matchingFolderVideos.length > 0) {
          const randomIndex = Math.floor(Math.random() * matchingFolderVideos.length);
          document.getElementById("image-label").textContent =
            matchingFolderVideos[randomIndex].slice(5, -4).split(" - ").pop();
          return `Van Videos Categorised/${key}/${matchingFolderVideos[randomIndex]}`;
        }
      }

      throw new Error(`No videos found for time of day: ${timeOfDay}`);
    }
  } catch (error) {
    console.error("Failed to get random video source:", error);
    return "default-video.mp4";
  }
};

const getTimeOfDay = (sunsetTime) => {
  const now = new Date();
  const currentHour = now.getHours();
  const chosenTime = parseInt(extractTime().split(":")[0], 10);
  const isNextDay = chosenTime < currentHour;

  if (isNextDay) {
    return chosenTime < 6 ? "Night" : "Day";
  } else {
    if (chosenTime < sunsetTime - 1) {
      return "Day";
    } else if (chosenTime >= sunsetTime - 1 && chosenTime <= sunsetTime + 1) {
      return "Sunset";
    } else {
      return "Night";
    }
  }
};

const updateUI = (videoSource, temperature, formattedTime, weatherDesc, city) => {
  const videoElement = document.querySelector("video");
  const videoSourceElement = document.getElementById("video-source");
  const temperatureElement = document.getElementById("temperature");
  const timeElement = document.getElementById("time");
  const locationElement = document.getElementById("location");

  videoElement.classList.remove("show");
  
  setTimeout(() => {
    videoSourceElement.src = videoSource;

    videoSourceElement.onerror = () => {
      videoSourceElement.src = "default-video.mp4";
      videoElement.load();
    };

    videoElement.load();

    temperatureElement.textContent = `${temperature}°`;
    timeElement.textContent = new Date().getHours() == formattedTime.split(':')[0] ? 'now' : formattedTime;
    locationElement.textContent = `${weatherDesc}, ${city}`;

    setTimeout(() => {
      videoElement.classList.add("show");
    }, 700);
  }, 700);
};

const getLocationFromBrowser = async () => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
          const response = await fetch(geoApiUrl);
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

const initializeTimeBar = () => {
  const timeBar = document.getElementById('time-bar');
  const timeDisplay = document.getElementById('time');
  let isMouseDown = false;
  let startX;
  let scrollLeft;

  for (let i = -15; i < 38; i++) {
    const line = document.createElement('div');

    if (i == 15) {
      line.classList.add('big-line');
    } else if (i == 14 || i == 16) {
      line.classList.add('medium-line');
    }

    line.classList.add('line');

    if (hours < 24 && i >= 0 && i < 24) {
      line.id = `hour-${hours}`;
      hours++;
    } else if (i >= 0 && i < 24) {
      hours = 0;
      line.id = `hour-${hours}`;
      hours++;
    }

    const hourContainer = document.createElement('div');
    hourContainer.style.width = '20px';
    hourContainer.style.position = 'relative';
    hourContainer.style.display = 'flex';
    hourContainer.style.flexDirection = 'column';
    hourContainer.style.alignItems = 'center';

    hourContainer.appendChild(line);
    timeBar.appendChild(hourContainer);
  }

  const highlightCenterLine = () => {
    const lines = Array.from(document.querySelectorAll('.line'));
    const timeBarRect = timeBar.getBoundingClientRect();
    const centerX = timeBarRect.left + timeBarRect.width / 2;

    let closestLine = null;
    let minDistance = Infinity;

    lines.forEach((line) => {
      const lineRect = line.getBoundingClientRect();
      const lineCenterX = lineRect.left + lineRect.width / 2;
      const distance = Math.abs(lineCenterX - centerX);

      if (distance < minDistance) {
        closestLine = line;
        minDistance = distance;
      }
    });

    lines.forEach((line) => line.classList.remove('big-line', 'medium-line', 'zoomed'));

    if (closestLine) {
      closestLine.classList.add('big-line', 'zoomed');

      const centerIndex = lines.indexOf(closestLine);
      const leftAdjacent = lines[centerIndex - 1];
      const rightAdjacent = lines[centerIndex + 1];

      if (leftAdjacent) leftAdjacent.classList.add('medium-line', 'zoomed');
      if (rightAdjacent) rightAdjacent.classList.add('medium-line', 'zoomed');

      const hour = (hours = parseInt(closestLine.id.split('-')[1], 10));

      const formattedTime = `${String(hour).padStart(2, '0')}:00`;

      timeDisplay.textContent = formattedTime;
    }
  };

  const clearZoom = () => {
    const lines = document.querySelectorAll('.line');
    lines.forEach((line) => line.classList.remove('zoomed'));
  };

  highlightCenterLine();
  clearZoom();

  timeBar.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    timeBar.classList.add('active');
    startX = e.pageX - timeBar.offsetLeft;
    scrollLeft = timeBar.scrollLeft;
    e.preventDefault();
  });

  timeBar.addEventListener('mouseleave', () => {
    isMouseDown = false;
    timeBar.classList.remove('active');
    clearZoom();
  });

  timeBar.addEventListener('mouseup', async () => {
    isMouseDown = false;
    timeBar.classList.remove('active');
    clearZoom();
    const timeIndex = getWeatherIndex(hours, data) || 0;
    if (location) {
      const { latitude, longitude, city } = location;
      await getWeatherData(latitude, longitude, city, timeIndex);
    } else {
      console.error("Could not determine location.");
    }
  });

  timeBar.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    const x = e.pageX - timeBar.offsetLeft;
    const walk = (x - startX) * 0.5;
    timeBar.scrollLeft = scrollLeft - walk;
    highlightCenterLine();
  });

  timeBar.addEventListener('scroll', () => {
    highlightCenterLine();
  });

  timeBar.addEventListener('touchstart', (e) => {
    isMouseDown = true;
    timeBar.classList.add('active');
    startX = e.touches[0].pageX - timeBar.offsetLeft;
    scrollLeft = timeBar.scrollLeft;
  });

  timeBar.addEventListener('touchmove', (e) => {
    if (!isMouseDown) return;
    const x = e.touches[0].pageX - timeBar.offsetLeft;
    const walk = (x - startX) * 0.5;
    timeBar.scrollLeft = scrollLeft - walk;
    highlightCenterLine();
  });

  timeBar.addEventListener('touchend', async () => {
    isMouseDown = false;
    timeBar.classList.remove('active');
    clearZoom();
    const timeIndex = getWeatherIndex(hours, data) || 0;
    if (location) {
      const { latitude, longitude, city } = location;
      await getWeatherData(latitude, longitude, city, timeIndex);
    } else {
      console.error("Could not determine location.");
    }
  });

  return hours;
};

const getWeatherIndex = (hour, apiResponse) => {
  const timestamps = apiResponse.list.slice(0, 9).map(entry => entry.dt_txt);
  return timestamps.reduce((closest, currentTimestamp, index) => {
    const apiHour = parseInt(currentTimestamp.split(" ")[1].split(":")[0], 10);
    return Math.abs(apiHour - hour) < Math.abs(parseInt(timestamps[closest].split(" ")[1].split(":")[0], 10) - hour)
      ? index
      : closest;
  }, 0);
};

const mainFunction = async () => {
  location = await getLocationFromBrowser();
  if (location) {
    const { latitude, longitude, city } = location;
    await getWeatherData(latitude, longitude, city);
  } else {
    console.error("Could not determine location.");
  }
};

window.onload = async () => {
  //console.log("Testing starting");
  await mainFunction();
  hours = initializeTimeBar();
  await testBackgroundImages();
};

const testBackgroundImages = async () => {
  const weatherCodes = [
    800, 801, 802, 803, 804, 
    200, 202, 230, 
    300, 301, 
    500, 501, 502, 503, 521, 
    600, 601, 602, 622, 
    701, 721, 741, 771
  ];
  const timesOfDay = ["Day", "Sunset", "Night"];

  for (const code of weatherCodes) {
    const weatherDescription = getWeatherCondition(code);
    
    for (const forcedTime of timesOfDay) {
      const originalGetTimeOfDay = getTimeOfDay;
      
      window.getTimeOfDay = () => forcedTime;
      
      const videoSource = await getRandomVideoSource(weatherDescription, 18);
      
      /*console.log(
        `Weather code: ${code} (${weatherDescription}), Time: ${forcedTime} => Video Source: ${videoSource}`
      );*/
      
      window.getTimeOfDay = originalGetTimeOfDay;

      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};
