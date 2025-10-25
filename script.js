let lootItems = [];
let dataLoaded = false;
let dataError = false;

const searchBar = document.getElementById('searchBar');
const suggestions = document.getElementById('suggestions');
const lootInfo = document.getElementById('lootInfo');
const clearBtn = document.getElementById('clearBtn');
const imageContainer = document.getElementById('imageContainer');


// fetch data
fetch('lootItems.json')
  .then(res => {
    if (!res.ok) throw new Error('Network response not ok');
    return res.json();
  })
  .then(data => {
    lootItems = data;
    dataLoaded = true;
  })
  .catch(err => {
    console.error('Error loading/parsing lootItems.json:', err);
    dataError = true;
    suggestions.innerHTML = '<li style="color: #ff6b6b;">Error loading data</li>';
    suggestions.style.display = 'block';
  });

// initial UI state
clearBtn.style.display = 'none';
suggestions.style.display = 'none';
imageContainer.style.display = 'none';
lootInfo.style.display = 'none';

function showSuggestionsContent(html) {
  suggestions.innerHTML = html;
  suggestions.style.display = 'block';
}
function hideSuggestions() {
  suggestions.innerHTML = '';
  suggestions.style.display = 'none';
}

searchBar.addEventListener('input', () => {
  const query = searchBar.value.trim().toLowerCase();

  // hide prior suggestions and info when editing
  suggestions.innerHTML = '';
  hideSuggestions();

  // hide image/info if query empty
  if (query.length === 0) {
    lootInfo.innerHTML = '';
    lootInfo.style.display = 'none';
    imageContainer.innerHTML = '';
    imageContainer.style.display = 'none';
    clearBtn.style.display = 'none';
    return;
  }

  // show clear button
  clearBtn.style.display = 'inline';

  // if we failed to load data, show error (and return)
  if (dataError) {
    showSuggestionsContent('<li style="color: #ff6b6b;">Error loading data</li>');
    return;
  }

  // if data not yet loaded, show temporary message (no infinite loop — message is harmless)
  if (!dataLoaded) {
    showSuggestionsContent('<li style="color: #aaa;">Loading data...</li>');
    return;
  }

  // normal search
  const matches = lootItems
    .filter(item => item.name.toLowerCase().includes(query))
    .slice(0, 10);

  if (matches.length === 0) {
    showSuggestionsContent('<li style="color: #aaa;">No results found</li>');
    return;
  }

  // show matches
  suggestions.innerHTML = '';
  matches.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    li.tabIndex = 0;
    li.addEventListener('click', () => showItem(item));
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') showItem(item);
    });
    suggestions.appendChild(li);
  });
  suggestions.style.display = 'block';
});

// clear button
clearBtn.addEventListener('click', () => {
  searchBar.value = '';
  hideSuggestions();
  lootInfo.innerHTML = '';
  lootInfo.style.display = 'none';
  imageContainer.innerHTML = '';
  imageContainer.style.display = 'none';
  clearBtn.style.display = 'none';
  searchBar.focus();
});

function showItem(item) {
  const imageURL = `images/${item.name.toLowerCase().replace(/ /g, '-')}.png`;

  imageContainer.innerHTML = `
    <img src="${imageURL}" alt="${item.name}" style="width:100%; max-height:300px; object-fit: contain;">
  `;
  imageContainer.style.display = 'block';

  lootInfo.innerHTML = `
    <h2>${item.name}</h2>
    <p><strong>Rarity:</strong> ${item.rarity}</p>
    <p><strong>Location:</strong> ${item.location}</p>
    <p><strong>Sells For:</strong> ${item["sells for"]} gold</p>
    <p><strong>Company:</strong> ${item.company}</p>
  `;
  lootInfo.style.display = 'block';

  hideSuggestions();
  searchBar.value = item.name;
  clearBtn.style.display = 'inline';
}
