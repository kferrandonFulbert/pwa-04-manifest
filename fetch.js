var beers;

/**************************
***         MODEL
***************************/
// Function to fetch beers from Punk API
async function modelFetchBeers() {
  beers = await fetch('https://api.punkapi.com/v2/beers')
    .then(response => response.json())
    .then(data => displayBeers(data))
    .catch(error => console.error('Error fetching beers:', error));
}
/**************************
  ***         VIEW
  ***************************/
// function ECMA 6 represent the view template
var template = (beer) => {
    url = beer.image_url;
   // console.log(url);
if(url==undefined){
 url = "beer.jpeg";
}
  return `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        <img src="${url}" class="card-img-top" alt="${beer.name}" style="width: 150px;height: 250px;margin:auto;" >
                        <div class="card-body">
                            <h5 class="card-title">${beer.name}</h5>
                            <p class="card-text">${beer.description}</p>
                        </div>
                    </div>
                </div>
            `;
}
/**************************
***         CONTROLLER
***************************/
// Function to display beers on the page
function displayBeers(beers) {
  const beerList = document.getElementById('beerList');
  beerList.innerHTML = '';
  beers.forEach(beer => {
    beerList.innerHTML += template(beer);
  });
  return beers;
}
// Function to filter beers based on search input
function filterBeers() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const filteredBeers = beers.filter(beer => beer.name.toLowerCase().includes(searchInput));
  displayBeers(filteredBeers);
}
// Event listener for search input
document.getElementById('searchInput').addEventListener('input', filterBeers);
