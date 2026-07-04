const userInput = document.getElementById('userInput');
const addUserButton = document.getElementById('addUserButton');

const userList = document.getElementById('userList');

let users = [];

addUserButton.addEventListener('click', () => {
    const userName = userInput.value.trim();
    if (userName) {
        users.push({ name: userName, id: users.length + 1, kills: 0, deaths: 0, assists: 0 });
        renderUserList();
        userInput.value = '';
    }
});

function renderUserList() {
    userList.innerHTML = '';
    users.forEach(user => {
        const userItem = document.createElement('tr');
        userItem.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td class="changable">${user.kills}</td>
            <td class="changable">${user.deaths}</td>
            <td class="changable">${user.assists}</td>
        `;
        userList.appendChild(userItem);
    });
    console.log('Successfully rendered user list');
}

userList.addEventListener('click', function (event) {
    const cell = event.target.closest('.changable');
    if (!cell) return;

    console.log('Cell clicked:', cell.textContent);
    const currentValue = parseInt(cell.textContent);
    const newValue = prompt('Enter new value:', currentValue);
    if (newValue !== null && !isNaN(newValue)) {
        cell.textContent = newValue;
        const row = cell.closest('tr');
        const userId = parseInt(row.cells[0].textContent);
        const user = users.find(u => u.id === userId);

        if (!user) return;

        if (cell.cellIndex === 2) {
            user.kills = parseInt(newValue);
        } else if (cell.cellIndex === 3) {
            user.deaths = parseInt(newValue);
        } else if (cell.cellIndex === 4) {
            user.assists = parseInt(newValue);
        }
    }
});

function calculatePlayerStats(
  playerKills,
  playerAssists,
  playerDeaths,
  totalKills,
  totalDeaths,
  totalPlayers
) {
  const kda = Number(
    ((playerKills + playerAssists) / Math.max(playerDeaths, 1)).toFixed(2)
  );

  const score = Math.max(
    0,
    Math.round(playerKills * 5 + playerAssists * 3 - playerDeaths * 4)
  );

  const avgKills = totalKills / totalPlayers;
  const avgDeaths = totalDeaths / totalPlayers;

  const killRatio = playerKills / Math.max(avgKills, 1);
  const deathRatio = avgDeaths / Math.max(playerDeaths, 1);

  const performance =
    ((killRatio * 0.7 + deathRatio * 0.3) * 100);

  let tier;

  if (performance >= 250) tier = "SS";
  else if (performance >= 200) tier = "S";
  else if (performance >= 150) tier = "A";
  else if (performance >= 110) tier = "B";
  else if (performance >= 80) tier = "C";
  else if (performance >= 50) tier = "D";
  else tier = "F";

  return {
    kda,
    score,
    performance: Number(performance.toFixed(1)),
    tier,
  };
}

function generateTierList() {
    const totalKills = users.reduce((sum, user) => sum + user.kills, 0);
    const totalDeaths = users.reduce((sum, user) => sum + user.deaths, 0);
    const totalPlayers = users.length;
    let tierListItems = {};
    const calculatedTiers = users.map(user => {
        const { kda, score, tier, performance } = calculatePlayerStats(user.kills, user.assists, user.deaths, totalKills, totalDeaths, totalPlayers);
        return { ...user, kda, score, tier, performance };
    });
    for (const user of calculatedTiers) {
        tierListItems[user.tier] = tierListItems[user.tier] || [];
        tierListItems[user.tier].push(user);
    }
    return tierListItems;
}

function renderTierList() {
    const tierListContainer = document.getElementById('tierlistContainer');
    tierListContainer.innerHTML = '';

    const tierListItems = generateTierList();

    for (const [tier, users] of Object.entries(tierListItems)) {
        const tierSection = document.createElement('div');
        tierSection.className = 'tier-section';
        const tierHeader = document.createElement('h3');
        tierHeader.textContent = `Tier ${tier}`;
        tierSection.appendChild(tierHeader);

        const userTable = document.createElement('table');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>ID</th>
            <th>Name</th>
            <th>Kills</th>
            <th>Deaths</th>
            <th>Assists</th>
            <th>KDA</th>
            <th>Score</th>
            <th>Performance</th>
        `;
        userTable.appendChild(headerRow);

        users.forEach(user => {
            const userRow = document.createElement('tr');
            userRow.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.kills}</td>
                <td>${user.deaths}</td>
                <td>${user.assists}</td>
                <td>${user.kda}</td>
                <td>${user.score}</td>
                <td>${user.performance}</td>
            `;
            userTable.appendChild(userRow);
        });

        tierSection.appendChild(userTable);
        tierListContainer.appendChild(tierSection);
    }
}

const generateTierListButton = document.getElementById('calculateButton');
generateTierListButton.addEventListener('click', renderTierList);