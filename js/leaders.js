(() => {
  'use strict';
  const leaderboard = {};
  leaderboard.getURLParam = function(param) {
    const url = new URL(location.href);
    const searchParams = new URLSearchParams(url.search);
    return searchParams.get(param);
  };
  leaderboard.createList = function(id) {
    return document
      .getElementById(id)
      .value.split(',')
      .join();
  };

  leaderboard.updateUrl = function() {
    let newUrl = '?names=' + leaderboard.createList('names');
    window.location = encodeURI(newUrl);
  };

  leaderboard.addRows = function(id, element) {
    const tableBodyRef = document.getElementById(id).getElementsByTagName('tbody')[0];
    let newRow = tableBodyRef.insertRow(tableBodyRef.rows.length);
    let newCell = newRow.insertCell(0);
    newCell.appendChild(document.createTextNode(element.rank));
    newCell = newRow.insertCell(1);
    newCell.appendChild(document.createTextNode(element.name));
    newCell = newRow.insertCell(2);
    newCell.appendChild(document.createTextNode(element.points));
    newCell = newRow.insertCell(3);
    newCell.appendChild(document.createTextNode(element.percentile));
  };

  leaderboard.getRequest = function(jsonFile, id, nameList) {
    fetch('https://projects.fivethirtyeight.com/nfl-api/2021/' + jsonFile + '.json')
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data !== null) {
          data.forEach(function(element) {
            nameList.includes(element.name) && leaderboard.addRows(id, element);
          });
        }
      });
  };

  leaderboard.getNameArray = function(nameList) {
    document.getElementById('names').value = nameList;
    nameList = nameList.split(',');
    return nameList.map(Function.prototype.call, String.prototype.trim);
  };

  leaderboard.getWeek = function() {
    const now = new Date();
    const newYear = new Date(now.getFullYear(), 0, 1);
    return Math.ceil(((now - newYear) / 86400000 + newYear.getDay() + 1) / 7);
  };

  const weekSelect = document.getElementById('week');
  weekSelect.addEventListener('change', event => {
    leaderboard.updateWeek(week.options[week.selectedIndex].value);
  });

  leaderboard.updateWeek = function(weekNumber) {
    document.getElementById('weeklyLeaderboard').getElementsByTagName('tbody')[0].innerHTML = '';
    leaderboard.getRequest('leaderboard_week_' + weekNumber, 'weeklyLeaderboard', names);
  };

  leaderboard.setWeeks = function() {
    for (let w = 1; w <= 18; w++) {
      let opt = document.createElement('option');
      opt.value = w;
      opt.innerHTML = w;
      weekSelect.appendChild(opt);
    }
  };

  let names = leaderboard.getURLParam('names');
  if (names != null) {
    leaderboard.setWeeks();
    names = leaderboard.getNameArray(names);
    leaderboard.getRequest('leaderboard', 'leaderboard', names);
    const currentWeek = leaderboard.getWeek();
    let weekNumber = currentWeek - 36;
    if (weekNumber <= 0) {
      weekNumber += 52;
      if (weekNumber > 18) {
        weekNumber = 18;
      }
    }
    leaderboard.getRequest('leaderboard_week_' + weekNumber, 'weeklyLeaderboard', names);
    document.getElementById('week').selectedIndex = weekNumber - 1;
  }

  document.getElementById('sub').onclick = leaderboard.updateUrl;

  document.getElementById('names').addEventListener('keyup', function(event) {
    event.preventDefault();
    event.keyCode === 13 && document.getElementById('sub').click();
  });
})();
