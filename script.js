import CONFIG from './config.js'; // Adjust the path to point to the location of `config.js`

const WEATHER_API_KEY = CONFIG.WEATHER_API_KEY;
const WEATHER_BASE_URL = CONFIG.WEATHER_BASE_URL;
const IPINFO_ACCESS_TOKEN = CONFIG.IPINFO_ACCESS_TOKEN;
const IPINFO_API_URL = CONFIG.IPINFO_API_URL;

let weatherCategories = {
  "200_Thunderstorm_thunderstorm with light rain": [
      "200 - Day - The Plain at Auvers (1890).mp4",
      "200 - Day - Wheatfield under Thunderclouds.mp4",
      "200 - Sunset - View of the Sea at Scheveningen.mp4"
  ],
  "202_Thunderstorm_thunderstorm with heavy rain": [
      "202 - Day - Rain (1889).mp4",
      "202 - Sunset - View of the Sea at Scheveningen.mp4"
  ],
  "230_Thunderstorm_thunderstorm with light drizzle": [
      "230 - Day - Wheatfield with Crows.mp4",
      "230 - Sunset - View of the Sea at Scheveningen.mp4"
  ],
  "300_Drizzle_light intensity drizzle": [
      "300 - Day - The Plain at Auvers (1890).mp4"
  ],
  "301_Drizzle_drizzle": [
      "301 - Day - The Outskirts of Paris (1886).mp4"
  ],
  "500_Rain_light rain": [
      "500 - Day - Rain (1889).mp4",
      "500 - Sunset - View of the Sea at Scheveningen.mp4"
  ],
  "501_Rain_moderate rain": [
      "501 - Day - Landscape at Auvers in the Rain (1890).mp4",
      "501 - Day - Rain (1889).mp4",
      "501 - Day - Sower in the Rain.mp4",
      "501 - Day - Three Men Shouldering Spades on a Road in the Rain.mp4",
      "501 - Sunset - Landscape at Auvers in the Rain (1890).mp4",
      "501 - Sunset - Rain (1889).mp4"
  ],
  "502_Rain_heavy intensity rain": [
      "502 - Day - Bridge in the Rain (after Hiroshige).mp4",
      "502 - Day - Rain (1889).mp4",
      "502 - Sunset - Landscape at Auvers in the Rain (1890).mp4"
  ],
  "503_Rain_very heavy rain": [
      "503 - Day - View of Paris from Vincent's Room in the Rue Lepic.mp4",
      "503 - Day - Rain (1889).mp4",
      "503 - Sunset - Landscape at Auvers in the Rain (1890).mp4"
  ],
  "521_Rain_shower rain": [
      "521 - Day - Couple with Child, Walking in the Rain.mp4",
      "521 - Day - Pollard Willow.mp4"
  ],
  "600_Snow_light snow": [
      "600 - Day - Snow-Covered Field with a Harrow (after Millet).mp4"
  ],
  "601_Snow_snow": [
      "601 - Day - The Vicarage Garden in the Snow (1885) Sketch.mp4",
      "601 - Day - Winter (The Vicarage Garden under Snow).mp4"
  ],
  "602_Snow_heavy snow": [
      "602 - Day - Landscape with Snow (1888).mp4"
  ],
  "622_Snow_heavy shower snow": [
      "622 - Day - The Old Cemetery Tower at Nuenen in the Snow.mp4"
  ],
  "701_Mist_mist": [
      "701 - Day - Avenue of Poplars.mp4",
      "701 - Day - Congregation Leaving the Reformed Church in Nuenen.mp4",
      "701 - Day - Factories at Asnières (1887).mp4",
      "701 - Day - Impasse des Deux Frères.mp4",
      "701 - Day - The De Ruijterkade in Amsterdam.mp4",
      "701 - Day - The Old Church Tower at Nuenen (The Peasants' Churchyard).mp4",
      "701 - Sunset - The Old Church Tower at Nuenen (The Peasants' Churchyard).mp4",
      "701 - Sunset - The Vicarage at Nuenen.mp4"
  ],
  "721_Haze_haze": [
      "712 - Day - Impasse des Deux Frères.mp4",
      "712 - Day - Montmartre Behind the Moulin de la Galette.mp4",
      "712 - Day - The Langlois Bridge at Arles.mp4"
  ],
  "741_Fog_fog": [
      "741 - Day - Autumn Landscape with Four Trees (1885).mp4",
      "741 - Day - Impasse des Deux Frères.mp4"
  ],
  "771_Squall_squalls": [
      "771 - Day - Seascape near Les Saintes-Maries-de-la-Mer.mp4",
      "771 - Day - View of the Sea at Scheveningen.mp4",
      "771 - Day - Wheatfield under Thunderclouds.mp4"
  ],
  "800_Clear_clear sky": [
      "800 - Day - Allotment with Sunflower.mp4",
      "800 - Day - Avenue of Poplars.mp4",
      "800 - Day - Bank of the Seine.mp4",
      "800 - Day - By the Seine.mp4",
      "800 - Day - The Harvest.mp4",
      "800 - Day - The White Orchard.mp4",
      "800 - Day - View of Auvers-sur-Oise.mp4",
      "800 - Day - Wheatfield with a Reaper.mp4",
      "800 - Day - Wheatfield.mp4",
      "800 - Night - Cafe Terrace at Night.mp4",
      "800 - Night - Starry Night Over the Rhône.mp4",
      "800 - Night - The Yellow House (The Street).mp4"
  ],
  "801_Clouds_few clouds 11 - 25": [
      "801 - Day - Allotment with Sunflower.mp4",
      "801 - Day - Field with Irises near Arles.mp4",
      "801 - Day - Field with Poppies.mp4",
      "801 - Day - Montmartre Windmills and Allotments.mp4",
      "801 - Day - Orchards in Blossom, View of Arles.mp4",
      "801 - Day - Peasant Woman Binding Sheaves (after Millet).mp4",
      "801 - Day - The Bridge at Courbevoie.mp4",
      "801 - Day - The Pink Orchard.mp4",
      "801 - Day - The Pink Peach Tree.mp4",
      "801 - Day - The Raising of Lazarus (after Rembrandt).mp4",
      "801 - Day - The Reaper (after Millet).mp4",
      "801 - Day - The Sheaf-Binder (after Millet).mp4",
      "801 - Day - The Sower.mp4",
      "801 - Day - The White Orchard.mp4",
      "801 - Day - Wheatfield.mp4",
      "801 - Night - The Yellow House (The Street).mp4",
      "801 - Sunset - Orchard in Blossom.mp4",
      "801 - Sunset - The Bridge at Courbevoie.mp4",
      "801 - Sunset - The Reaper (after Millet).mp4",
      "801 - Sunset - The Sower.mp4"
  ],
  "802_Clouds_scattered clouds 25-50": [
      "802 - Day - Allotment with Sunflower.mp4",
      "802 - Day - Bank of the Seine.mp4",
      "802 - Day - Boulevard de Clichy.mp4",
      "802 - Day - Farmhouse in a Wheatfield.mp4",
      "802 - Day - Field with Irises near Arles.mp4",
      "802 - Day - Field with Poppies.mp4",
      "802 - Day - Fishing Boats on the Beach at Les Saintes-Maries-de-la-Mer.mp4",
      "802 - Day - Garden of the Asylum.mp4",
      "802 - Day - Garden with Courting Couples Square Saint-Pierre.mp4",
      "802 - Day - Gate in the Paris Ramparts.mp4",
      "802 - Day - Impasse des Deux Frères.mp4",
      "802 - Day - Montmartre Behind the Moulin de la Galette.mp4",
      "802 - Day - Old Vineyard with Peasant Woman.mp4",
      "802 - Day - Ploughed Fields (The Furrows).mp4",
      "802 - Day - View from Theo's Apartment.mp4",
      "802 - Day - View of the Alpilles.mp4",
      "802 - Day - View of the Sea at Scheveningen.mp4",
      "802 - Sunset - Landscape at Twilight.mp4",
      "802 - Sunset - Olive Grove.mp4",
      "802 - Sunset - Path in Montmartre.mp4",
      "802 - Sunset - Square Saint-Pierre at Sunset.mp4",
      "802 - Sunset - Sunset in Montmartre.mp4"
  ],
  "803_Clouds_broken clouds 51-84": [
      "803 - Day - Boulevard de Clichy.mp4",
      "803 - Day - Farmhouse in a Wheatfield.mp4",
      "803 - Day - Garden with Courting Couples Square Saint-Pierre.mp4",
      "803 - Day - The Hill of Montmartre with Stone Quarry.mp4",
      "803 - Night - Olive Grove.mp4",
      "803 - Night - The Starry Night.mp4",
      "803 - Night - Wheatfield with Crows.mp4",
      "803 - Sunset - Olive Grove.mp4",
      "803 - Sunset - View from Vincent's Studio.mp4"
  ],
  "804_Clouds_overcast clouds 85-100": [
      "804 - Day - Farm with Stacks of Peat.mp4",
      "804 - Day - Houses Seen from the Back.mp4",
      "804 - Day - The Old Church Tower at Nuenen (The Peasants' Churchyard).mp4",
      "804 - Day - View of Paris.mp4",
      "804 - Day - Women on the Peat Moor.mp4",
      "804 - Night - The Starry Night.mp4",
      "804 - Night - Wheatfield with Crows.mp4",
      "804 - Sunset - Congregation Leaving the Reformed Church in Nuenen.mp4",
      "804 - Sunset - Cottages.mp4",
      "804 - Sunset - Farm with Stacks of Peat.mp4",
      "804 - Sunset - Reminiscence of Brabant.mp4",
      "804 - Sunset - The Cottage.mp4",
      "804 - Sunset - Women on the Peat Moor.mp4"
  ]
};

// Function to interpret the weather code and condition
function getWeatherCondition(weatherCode) {
  switch (weatherCode) {
    case 800:
      return "Van Videos Categorised/800_Clear_clear sky";
    case 801:
      return "Van Videos Categorised/801_Clouds_few clouds 11 - 25";
    case 802:
      return "Van Videos Categorised/802_Clouds_scattered clouds 25-50";
    case 803:
      return "Van Videos Categorised/803_Clouds_broken clouds 51-84";
    case 804:
      return "Van Videos Categorised/804_Clouds_overcast clouds 85-100";
    case 200:
      return "Van Videos Categorised/200_Thunderstorm_thunderstorm with light rain";
    case 202:
      return "Van Videos Categorised/202_Thunderstorm_thunderstorm with heavy rain";
    case 230:
      return "Van Videos Categorised/230_Thunderstorm_thunderstorm with light drizzle";
    case 300:
      return "Van Videos Categorised/300_Drizzle_light intensity drizzle";
    case 301:
      return "Van Videos Categorised/301_Drizzle_drizzle";
    case 500:
      return "Van Videos Categorised/500_Rain_light rain";
    case 501:
      return "Van Videos Categorised/501_Rain_moderate rain";
    case 502:
      return "Van Videos Categorised/502_Rain_heavy intensity rain";
    case 503:
      return "Van Videos Categorised/503_Rain_very heavy rain";
    case 521:
      return "Van Videos Categorised/521_Rain_shower rain";
    case 600:
      return "Van Videos Categorised/600_Snow_light snow";
    case 601:
      return "Van Videos Categorised/601_Snow_snow";
    case 602:
      return "Van Videos Categorised/602_Snow_heavy snow";
    case 622:
      return "Van Videos Categorised/622_Snow_heavy shower snow";
    case 701:
      return "Van Videos Categorised/701_Mist_mist";
    case 721:
      return "Van Videos Categorised/721_Haze_haze";
    case 741:
      return "Van Videos Categorised/741_Fog_fog";
    case 771:
      return "Van Videos Categorised/771_Squall_squalls";
    default:
      return "Unknown weather condition";
  }
}

// Function to fetch weather data
async function getWeatherData(lat, lon, city) {
  try {
    const response = await fetch(`${WEATHER_BASE_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`);
    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Weather data:", data);

    // Get weather condition for the first forecast period
    const weatherCode = data.list[0].weather[0].id;
    const weatherDesc = data.list[0].weather[0].main;
    const weatherDescription = getWeatherCondition(weatherCode);

    const temperature = Math.round(data.list[0].main.temp);
    const fullTime = data.list[0].dt_txt; // Format: "2024-12-09 21:00:00"
    const formattedTime = extractTime(fullTime);

    // Determine the video source based on the weather description
    const videoSource = await getRandomVideoSource(weatherDescription);

    // Update video element and dynamic content
    const videoSourceElement = document.getElementById("video-source");
    videoSourceElement.src = videoSource;

    const videoElement = document.querySelector("video");
    videoElement.load();

    document.getElementById("temperature").textContent = `${temperature}°`;
    document.getElementById("time").textContent = formattedTime;
    document.getElementById("location").textContent = `${weatherDesc}, ${city}`;

  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
}

// Function to extract time from API datetime format
function extractTime(apiTime) {
  const [date, time] = apiTime.split(" ");
  return time.slice(0, 5); // Extract hh:mm
}

// Function to fetch a random video source based on the weather description
async function getRandomVideoSource(weatherDescription) {
  try {
    const trimmedDescription = weatherDescription.split('/').pop();
    // Check if the trimmedDescription exists in weatherCategories
    if (!weatherCategories[trimmedDescription] || weatherCategories[trimmedDescription].length === 0) {
      throw new Error(`No videos available for weather condition: ${trimmedDescription}`);
    }

    // Get a random video from the weather category
    const videos = weatherCategories[trimmedDescription];
    const randomIndex = Math.floor(Math.random() * videos.length);
    document.getElementById("image-label").textContent = videos[randomIndex].slice(5, -4);
    return `${weatherDescription}/${videos[randomIndex]}`;
  } catch (error) {
    console.error("Failed to get random video source:", error);
    return "default-video.mp4"; // Return a default video if something goes wrong
  }
}

// Function to fetch location data using IPinfo API
async function getLocationFromIP() { 
  try {
    // Fetch location data from IPInfo
    const locationResponse = await fetch(`${IPINFO_API_URL}?token=${IPINFO_ACCESS_TOKEN}`);
    const locationData = await locationResponse.json();

    // Extract latitude and longitude from loc field
    const loc = locationData.loc; // Loc contains "latitude,longitude"

    if (!loc) {
      throw new Error('IPInfo did not return location coordinates.');
    }

    const [latitude, longitude] = loc.split(',');

    return { latitude, longitude, city: locationData.city };
  } catch (error) {
    console.error("Failed to fetch location from IP:", error);
    return null;
  }
}

// Time-bar functionality
function initializeTimeBar() {
  const timeBar = document.getElementById('time-bar');
  const timeDisplay = document.getElementById('time');
  let isMouseDown = false;
  let startX;
  let scrollLeft;

  // Create 24 lines for each hour
  for (let i = -7; i < 31; i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.id = `hour-${i}`; // Assign a unique ID for each line, e.g., "hour-0", "hour-1", ..., "hour-23"

    const hourContainer = document.createElement('div');
    hourContainer.style.position = 'relative';
    hourContainer.style.display = 'flex';
    hourContainer.style.flexDirection = 'column';
    hourContainer.style.alignItems = 'center';

    hourContainer.appendChild(line);
    timeBar.appendChild(hourContainer);
  }

  function highlightCenterLine() {
    const lines = Array.from(document.querySelectorAll('.line')); // Get all lines
    const timeBarRect = timeBar.getBoundingClientRect(); // Get the container's dimensions
    const centerX = timeBarRect.left + timeBarRect.width / 2; // Find the center of the time bar
  
    // Find the closest line to the center
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
  
    // Remove highlight and medium-highlight classes from all lines
    lines.forEach((line) => line.classList.remove('highlight', 'medium-highlight'));
  
    // Highlight the closest line to the center and its adjacent lines
    if (closestLine) {
      closestLine.classList.add('highlight');
  
      // Get adjacent lines
      const centerIndex = lines.indexOf(closestLine);
      const leftAdjacent = lines[centerIndex - 1];
      const rightAdjacent = lines[centerIndex + 1];
  
      if (leftAdjacent) leftAdjacent.classList.add('medium-highlight');
      if (rightAdjacent) rightAdjacent.classList.add('medium-highlight');
  
      // Extract the hour from the line ID (e.g., "hour-3" -> 3)
      const hour = parseInt(closestLine.id.split('-')[1], 10);
  
      // Format the time as HH:00
      const formattedTime = `${String(hour).padStart(2, '0')}:00`;
  
      // Update the existing #time div
      timeDisplay.textContent = formattedTime;
    }
  }  

  // Call the function to highlight the center line on load
  highlightCenterLine();

  // Mouse down event
  timeBar.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    timeBar.classList.add('active');
    startX = e.pageX - timeBar.offsetLeft;
    scrollLeft = timeBar.scrollLeft;
    e.preventDefault(); // Prevent text selection
  });

  // Mouse leave event
  timeBar.addEventListener('mouseleave', () => {
    isMouseDown = false;
    timeBar.classList.remove('active');
  });

  // Mouse up event
  timeBar.addEventListener('mouseup', () => {
    isMouseDown = false;
    timeBar.classList.remove('active');
  });

  // Mouse move event
  timeBar.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    const x = e.pageX - timeBar.offsetLeft;
    const walk = (x - startX) * 2; // Multiply for faster scrolling
    timeBar.scrollLeft = scrollLeft - walk;
    highlightCenterLine(); // Update the highlight during scroll
  });

  // Scroll event
  timeBar.addEventListener('scroll', () => {
    highlightCenterLine(); // Update the highlight on scroll
  });
}

// Initialize app
window.onload = async function () {
  const location = await getLocationFromIP();
  if (location) {
    const { latitude, longitude, city } = location; 
    await getWeatherData(latitude, longitude, city);
  } else {
    console.error("Could not determine location.");
  }
  initializeTimeBar();
};