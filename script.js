let lootItems = [];

fetch('lootItems.json')
  .then(res => res.json())
  .then(data => {
    lootItems = data;
  })
  .catch(err => console.error('Error loading lootItems.json:', err));

const searchBar = document.getElementById('searchBar');
const suggestions = document.getElementById('suggestions');
const lootInfo = document.getElementById('lootInfo');
const clearBtn = document.getElementById('clearBtn');
const imageContainer = document.getElementById('imageContainer');

searchBar.addEventListener('input', () => {
  if (lootItems.length === 0) {
    suggestions.innerHTML = '<li>Loading data...</li>';
    suggestions.style.display = 'block';
    clearBtn.style.display = 'none';
    imageContainer.style.display = 'none';
    lootInfo.style.display = 'none';
    return;
  }

  const query = searchBar.value.toLowerCase();
  suggestions.innerHTML = '';

  clearBtn.style.display = query.length > 0 ? 'inline' : 'none';

  if (query.length === 0) {
    suggestions.style.display = 'none';
    lootInfo.style.display = 'none';
    imageContainer.style.display = 'none';
    return;
  }

  const matches = lootItems.filter(item =>
    item.name.toLowerCase().includes(query)
  ).slice(0, 10);

  if (matches.length === 0) {
    suggestions.innerHTML = '<li>No results found</li>';
    suggestions.style.display = 'block';
  } else {
    matches.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name;
      li.addEventListener('click', () => showItem(item));
      suggestions.appendChild(li);
    });
    suggestions.style.display = 'block';
  }

  lootInfo.style.display = 'none';
  imageContainer.style.display = 'none';
});

// Clear button event
clearBtn.addEventListener('click', () => {
  searchBar.value = '';
  suggestions.innerHTML = '';
  suggestions.style.display = 'none';
  lootInfo.innerHTML = '';
  lootInfo.style.display = 'none';
  imageContainer.innerHTML = '';
  imageContainer.style.display = 'none';
  clearBtn.style.display = 'none';
  searchBar.focus();
});

function showItem(item) {
  const imageURL = `images/${item.name.toLowerCase().replace(/ /g, '-')}.png`;

  imageContainer.innerHTML = `<img src="${imageURL}" alt="${item.name}" style="max-width: 100%; height: auto; object-fit: contain;">`;
  imageContainer.style.display = 'block';

  lootInfo.innerHTML = `
    <h2><u>${item.name}</u></h2>
    <p><strong>Rarity:</strong> ${item.rarity}</p>
    <p><strong>Location:</strong> ${item.location}</p>
    <p><strong>Sells For:</strong> ${item["sells for"]} gold</p>
    <p><strong>Company:</strong> ${item.company}</p>
  `;
  lootInfo.style.display = 'block';

  suggestions.innerHTML = '';
  suggestions.style.display = 'none';

  searchBar.value = item.name;
  clearBtn.style.display = 'inline';
}
