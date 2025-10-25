let lootItems = [];
let dataLoaded = false;

fetch('lootItems.json')
  .then(res => res.json())
  .then(data => {
    lootItems = data;
    dataLoaded = true;
  })
  .catch(err => {
    console.error('Error loading lootItems.json:', err);
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '<li style="color: red;">Error loading data</li>';
  });

const searchBar = document.getElementById('searchBar');
const suggestions = document.getElementById('suggestions');
const lootInfo = document.getElementById('lootInfo');
const clearBtn = document.getElementById('clearBtn');
const imageContainer = document.getElementById('imageContainer');

// Show or hide clear button + search results
searchBar.addEventListener('input', () => {
  const query = searchBar.value.toLowerCase();
  suggestions.innerHTML = '';

  // Hide info and image if empty input
  if (query.length === 0) {
    lootInfo.innerHTML = '';
    imageContainer.innerHTML = '';
    clearBtn.style.display = 'none';
    return;
  }

  clearBtn.style.display = 'inline';

  // If data hasn’t loaded yet, show temporary message
  if (!dataLoaded) {
    suggestions.innerHTML = '<li style="color: #aaa;">Loading data...</li>';
    return;
  }

  // Normal search
  const matches = lootItems
    .filter(item => item.name.toLowerCase().includes(query))
    .slice(0, 10);

  if (matches.length === 0) {
    suggestions.innerHTML = '<li style="color: #aaa;">No results found</li>';
    return;
  }

  matches.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    li.addEventListener('click', () => showItem(item));
    suggestions.appendChild(li);
  });
});

// Clear button click event
clearBtn.addEventListener('click', () => {
  searchBar.value = '';
  suggestions.innerHTML = '';
  lootInfo.innerHTML = '';
  imageContainer.innerHTML = '';
  clearBtn.style.display = 'none';
  searchBar.focus();
});

function showItem(item) {
  const imageURL = `images/${item.name.toLowerCase().replace(/ /g, '-')}.png`;

  imageContainer.innerHTML = `
    <img src="${imageURL}" alt="${item.name}"
         style="width:100%; height: 150px; object-fit: contain;">
  `;

  lootInfo.innerHTML = `
    <h2>${item.name}</h2>
    <p><strong>Rarity:</strong> ${item.rarity}</p>
    <p><strong>Location:</strong> ${item.location}</p>
    <p><strong>Sells For:</strong> ${item["sells for"]} gold</p>
    <p><strong>Company:</strong> ${item.company}</p>
  `;

  suggestions.innerHTML = '';
  searchBar.value = item.name;
  clearBtn.style.display = 'inline';
}
