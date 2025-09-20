let playersData = [];
let comparePlayers = [];

fetch('players.json')
  .then(res => res.json())
  .then(data => {
    playersData = data.players;
    populateFilters(playersData);
    renderCards(playersData);
  });

function populateFilters(players) {
  const positionFilter = document.getElementById('positionFilter');
  positionFilter.addEventListener('change', applyFilters);
  
  const nameFilter = document.getElementById('nameFilter');
  nameFilter.addEventListener('input', applyFilters);
  
  document.getElementById('resetFilters').addEventListener('click', () => {
    positionFilter.value = '';
    nameFilter.value = '';
    renderCards(playersData);
  });
}

function applyFilters() {
  const pos = document.getElementById('positionFilter').value;
  const name = document.getElementById('nameFilter').value.toLowerCase();
  
  const filtered = playersData.filter(player => {
    const matchPos = pos === '' || player.Position === pos;
    const matchName = player.Name.toLowerCase().includes(name);
    return matchPos && matchName;
  });
  
  renderCards(filtered);
}

function renderCards(players) {
  const container = document.getElementById('playerContainer');
  container.innerHTML = '';
  
  players.forEach(player => {
    const card = document.createElement('div');
    card.classList.add('playerCard');
    
    card.innerHTML = `
      <h3>${player.Name} (${player.Position})</h3>
      <p>Team: ${player.Team} | Opponent: ${player.Opponent} | Week: ${player.Week}</p>
      <ul>
        <li>Passing Yards: ${player.PassingYards || 0}</li>
        <li>Passing TDs: ${player.PassingTouchdowns || 0}</li>
        <li>Rushing Yards: ${player.RushingYards || 0}</li>
        <li>Rushing TDs: ${player.RushingTouchdowns || 0}</li>
        <li>Receiving Yards: ${player.ReceivingYards || 0}</li>
        <li>Receiving TDs: ${player.ReceivingTouchdowns || 0}</li>
        <li>Fantasy Points: ${player.FantasyPoints}</li>
      </ul>
      <input type="checkbox" data-playerid="${player.PlayerID}" class="compareCheckbox"> Compare
    `;
    
    container.appendChild(card);
  });
  
  document.querySelectorAll('.compareCheckbox').forEach(cb => {
    cb.addEventListener('change', handleCompareSelection);
  });
}

function handleCompareSelection(e) {
  const id = Number(e.target.dataset.playerid);
  if (e.target.checked) {
    const player = playersData.find(p => p.PlayerID === id);
    if (player) comparePlayers.push(player);
  } else {
    comparePlayers = comparePlayers.filter(p => p.PlayerID !== id);
  }
}

document.getElementById('compareButton').addEventListener('click', () => {
  const container = document.getElementById('comparisonResults');
  container.innerHTML = '';
  
  if (comparePlayers.length < 2) {
    container.innerHTML = '<p>Select at least 2 players to compare.</p>';
    return;
  }

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  
  const stats = ['Name','Position','Team','PassingYards','PassingTouchdowns','RushingYards','RushingTouchdowns','ReceivingYards','ReceivingTouchdowns','FantasyPoints'];
  
  stats.forEach(stat => {
    const th = document.createElement('th');
    th.textContent = stat;
    headerRow.appendChild(th);
  });
  
  table.appendChild(headerRow);
  
  comparePlayers.forEach(player => {
    const row = document.createElement('tr');
    stats.forEach(stat => {
      const td = document.createElement('td');
      td.textContent = player[stat] !== undefined ? player[stat] : 0;
      row.appendChild(td);
    });
    table.appendChild(row);
  });
  
  container.appendChild(table);
});
