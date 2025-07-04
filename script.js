let lootItems = [];

fetch('lootItems.json')
  .then(res => res.json())
  .then(data => lootItems = data);

const searchBar = document.getElementById('searchBar');
const suggestions = document.getElementById('suggestions');
const lootInfo = document.getElementById('lootInfo');

searchBar.addEventListener('input', () => {
  const query = searchBar.value.toLowerCase();
  suggestions.innerHTML = '';

  if (query.length === 0) {
    lootInfo.innerHTML = '';
    return;
  }

  const matches = lootItems.filter(item =>
    item.name.toLowerCase().includes(query)
  ).slice(0, 10); // limit to 10 suggestions

  matches.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    li.addEventListener('click', () => showItem(item));
    suggestions.appendChild(li);
  });
});

function showItem(item) {
  lootInfo.innerHTML = `
    <h2>${item.name}</h2>
    <p><strong>Rarity:</strong> ${item.rarity}</p>
    <p><strong>Location:</strong> ${item.location}</p>
    <p><strong>Sells For:</strong> ${item.price} gold</p>
    <p><strong>Company:</strong> ${item.company}</p>
  `;
  suggestions.innerHTML = '';
  searchBar.value = item.name;
}
