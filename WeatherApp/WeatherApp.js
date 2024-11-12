const apikey = '902d530b3758cf737825b941a492bfd6';

async function weatherDetails() {
    try {
        const cityName = document.getElementById('searching').value.trim() || 'Almaty';
        const curLocation = document.getElementById('curLoc');
        const curTemperature = document.getElementById('curTemp');
        const curDescription = document.getElementById('curDesc');
        const curMaxTemp = document.getElementById('curMaxTemp');
        const curMinTemp = document.getElementById('curMinTemp');
        const restOfDayWrapper = document.querySelector('.restOfDay-wrapper');
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apikey}`);
        
        if (!response.ok) {
            if(response.status === 404){
                alert('Such city not found. Please try to write correctly');
            }
            throw new Error("Не удалось получить данные");
        }

        const data = await response.json();
        console.log(data);
        curLocation.textContent = data.city.name;
        curTemperature.textContent = `${Math.round(data.list[0].main.temp)}°C`;
        curDescription.textContent = data.list[0].weather[0].description;
        curMaxTemp.textContent = `Макс: ${Math.round(Math.max(...data.list.map(item => item.main.temp_max)))}°C`;
        curMinTemp.textContent = `Мин: ${Math.round(Math.min(...data.list.map(item => item.main.temp_min)))}°C`;
        updateWeeklyForecast(data);


        const hourlyWeather = data.list.slice(0, 8);  
        restOfDayWrapper.innerHTML = `
            <div class="restOfDay">
                <div class="restOfDay-top">
                    <div class="dayDescription"> 
                        <div>Влажность: ${data.list[0].main.humidity}%</div>
                        <div>Скорость ветра: ${data.list[0].wind.speed} м/с</div>
                        <div>Вероятность осадков: ${Math.round(data.list[0].pop * 100)}%</div>
                        ${
                            data.list[0].rain ? `Осадки: ${data.list[0].rain['3h']} мм.` : 
                            data.list[0].snow ? `Осадки: ${data.list[0].snow['3h']} мм.` : 
                            ''
                        }
                    </div>
                </div>
                <hr>
                <div class="restOfDay-bottom">
                    <div class="timeAndTemp">
                        <div class="timeRow">
                            ${hourlyWeather.map((hourData) => {
                                const hour = new Date(hourData.dt * 1000);
                                const time = hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                return `<div class="hourTime">${time}</div>`;
                            }).join('')}
                        </div>
                        <div class="tempRow">
                            ${hourlyWeather.map((hourData) => {
                                const temp = Math.round(hourData.main.temp);
                                return `<div class="hourTemp">${temp}°C</div>`;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);
    }
}

function updateWeeklyForecast(data) {
    const weekWeatherWrapper = document.querySelector('.weekWeather-wrapper');
    weekWeatherWrapper.innerHTML = `
    <div class="titleWeatherWeek">
         The weather forecast for the week
    </div>
    <hr>
    `; 
    const dailyTemps = {};

    data.list.forEach((entry) => {
        const date = new Date(entry.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
        if (dailyTemps[day]) {
            dailyTemps[day].min = Math.min(dailyTemps[day].min, entry.main.temp_min);
            dailyTemps[day].max = Math.max(dailyTemps[day].max, entry.main.temp_max);
        } else {

            dailyTemps[day] = {
                min: entry.main.temp_min,
                max: entry.main.temp_max,
            };
        }
    });





    for (let i = 0; i < 5; i++) { 
        const dayIndex = i * 8; 
        const dayContainer = document.createElement('div');
        const hr = document.createElement('hr');
    
        dayContainer.classList.add('weatherForWeek');
        dayContainer.innerHTML = `
            <div class="weatherLeft">
                <div class="dayWeek">${new Date(data.list[dayIndex].dt * 1000).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</div>
            </div>
            <div class="dayTemperatures"> 
                <div class="minTemp">Мин: ${Math.round(data.list[dayIndex].main.temp_min)}°C</div>
                <div class="maxTemp">Макс: ${Math.round(data.list[dayIndex].main.temp_max)}°C</div>
                <div>Вероятность осадков: ${Math.round(data.list[dayIndex].pop * 100)}%</div>
            </div>
        `;
        
        weekWeatherWrapper.appendChild(dayContainer);
        weekWeatherWrapper.appendChild(hr);
    }
    
}

document.getElementById('searchingButton').addEventListener('click', weatherDetails);



