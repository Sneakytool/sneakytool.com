const API_KEY = '{YOUR_API_KEY_HERE}';
const endpoint = 'https://api.sportsdata.io/v4/nfl/stats/json/PlayerSeasonStats/2025REG';

let playersData = [];
const cardsContainer = document.getElementById('cardsContainer');
const compareContainer = document.getElementById('compareContainer');

const teamFilter = document.getElementById('teamFilter');
const positionFilter = document.getElementById('positionFilter');
const searchPlayer = document.getElementById('searchPlayer');

let selectedPlayers = [];

// Fetch API data
fetch(endpoint, {
  headers: { 'Ocp-Apim-Subscription-Key': API_KEY }
})
.then(res => res.json())
.then(data => {
  playersData = data.slice(0, 20); // keep it demo-friendly
  populateFilters(playersData);
  renderCards(playersData);
})
.catch(err => {
  console.error('Error fetching SportsDataIO JSON:', err);
  cardsContainer.innerHTML = '<p style="text-align:center;color:#ffd700;">Demo data unavailable.</p>';
});

// Render cards
function renderCards(data) {
  cardsContainer.innerHTML = '';
  data.forEach(p => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <input type="checkbox" data-name="${p.Name}" /> Select
      <div class="player-name">${p.Name || '-'}</div>
      <div class="player-team">${p.Team || '-'} | ${p.Position || '-'}</div>
      <div class="stats">
        <div class="stat">Passing: ${p.PassingYards || 0}</div>
        <div class="stat">Rushing: ${p.RushingYards || 0}</div>
        <div class="stat">Receiving: ${p.ReceivingYards || 0}</div>
        <div class="stat">TDs: ${p.Touchdowns || 0}</div>
        <div class="stat highlight">FP: ${p.FantasyPoints || 0}</div>
      </div>
      <div style="text-align:center; margin-top:8px; color:#ffd700; font-weight:bold;">Demo / Coming Soon</div>
    `;
    // Add listener for compare checkbox
    div.querySelector('input[type=checkbox]').addEventListener('change', (e)=>{
      if(e.target.checked){
        selectedPlayers.push(p);
      } else {
        selectedPlayers = selectedPlayers.filter(pl => pl.Name !== p.Name);
      }
      renderCompare(selectedPlayers);
    });
    cardsContainer.appendChild(div);
  });
}

// Render compare section
function renderCompare(players){
  compareContainer.innerHTML = '';
  players.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'compare-card';
    div.innerHTML = `
      <div class="player-name">${p.Name}</div>
      <div class="player-team">${p.Team} | ${p.Position}</div>
      <div class="stats">
        <div class="stat">Passing: ${p.PassingYards || 0}</div>
        <div class="stat">Rushing: ${p.RushingYards || 0}</div>
        <div class="stat">Receiving: ${p.ReceivingYards || 0}</div>
        <div class="stat">TDs: ${p.Touchdowns || 0}</div>
        <div class="stat highlight">FP: ${p.FantasyPoints || 0}</div>
      </div>
    `;
    compareContainer.appendChild(div);
  });
}

// Populate filters
function populateFilters(data){
  const teams = [...new Set(data.map(p => p.Team))];
  const positions = [...new Set(data.map(p => p.Position))];
  teams.forEach(t=>{
    const opt = document.createElement('option'); opt.value = t; opt.textContent = t; teamFilter.appendChild(opt);
  });
  positions.forEach(pos=>{
    const opt = document.createElement('option'); opt.value = pos; opt.textContent = pos; positionFilter.appendChild(opt);
  });
}

// Apply filters
function applyFilters(){
  const team = teamFilter.value;
  const position = positionFilter.value;
  const search = searchPlayer.value.toLowerCase();
  const filtered = playersData.filter(p => 
    (!team || p.Team === team) &&
    (!position || p.Position === position) &&
    (!search || p.Name.toLowerCase().includes(search))
  );
  renderCards(filtered);
}

teamFilter.addEventListener('change', applyFilters);
positionFilter.addEventListener('change', applyFilters);
searchPlayer.addEventListener('input', applyFilters);
