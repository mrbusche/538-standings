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
  const request = new XMLHttpRequest();
  request.open('GET', 'https://projects.fivethirtyeight.com/nfl-api/2019/' + jsonFile + '.json');
  request.responseType = 'json';
  request.onload = function() {
    request.response.forEach(function(element) {
      if (nameList.includes(element.name)) {
        leaderboard.addRows(id, element);
      }
    });
  };
  request.send();
};

leaderboard.getNameArray = function(nameList) {
  document.getElementById('names').value = nameList;
  nameList = nameList.split(',');
  return nameList.map(Function.prototype.call, String.prototype.trim);
};

let names = leaderboard.getURLParam('names');
if (names != null) {
  names = leaderboard.getNameArray(names);
  leaderboard.getRequest('leaderboard', 'leaderboard', names);
  leaderboard.getRequest('leaderboard_week_7', 'weeklyLeaderboard', names);
}

const b = document.getElementById('sub');
b.onclick = leaderboard.updateUrl;

document.getElementById('names').addEventListener('keyup', function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById('sub').click();
  }
});
