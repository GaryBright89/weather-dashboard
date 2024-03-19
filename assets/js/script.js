const container = $('#results-container');

function initFetch() {
    const currentUrl = location.search;
    const searchParams = new URLSearchParams(currentUrl)
    const city = searchParams.get('city');
    const search =  searchParams.get('search?query');
    const APIKey = 'cb37cc7caf84c8b235be1e55107a2817'
    return {city, APIKey, search};
}

async function fectchData({lat, lon}) {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${cb37cc7caf84c8b235be1e55107a2817}`;

  try {  
    const res = await fetch(url);
    const data = await res.json();
    console.log(data)
    const articlesArray = data.content.results.map((article) => {
        return {
            title: article.title,
            date: article.date,
            subject: article.subject,
            description: article.description
              ? article.description
              : ['No description for this entry.'],
            button: article.id,
        };
    });

    container.empty();
    return articlesArray;
  } catch (error) {
    resultsHeading.text('Error');
    console.error(error);
  }
}

function createCardElement({date, icon, temperature, wind, humidity}) {

    const card = $('<dive class= "card">');
    console.log(button)
    card.html(`
    <div class='card-body d-flex flex-column gap-2'>
    <div>
        <h4 class='card=title'>${title ? title : 'Entry has no title'}</h4>
        <h5 class='card-subtitle mb-2 text-body-secondary'>Date: ${
          date ? date : 'Entry has no date'
        }</h5>
        </div>
        <div>
        <p class='card-text m-0 fw-semibold border-bottom'>Subjects</p>
        <p class='card-text m-0'>${
          icon ? icon : 'Entry has no icon'
        }</p></div>
        <div>
        <p class='card-text m-0 fw-semibold border-bottom'>Temp:</p>
        <p class='card-text m-0'>${
          temperature ? temperature : 'Entry has no temperature'
        }</p>
        </div>
        <div>
        <p class='card-text m-0 fw-semibold border-bottom'>Wind:</p>
        <p class='card-text m-0'>${
          wind ? wind : 'Entry has no wind'
        }</p></div>
        <div>
        <p class='card-text m-0 fw-semibold border-bottom'>Humidity:</p>
        <p class='card-text m-0'>${
          humidity ? humidity : 'Entry has no humidity'
        }</p></div>
      `)


    return card;
}

