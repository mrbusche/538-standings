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
let names = leaderboard.getURLParam('names');
if (names != null) {
  document.getElementById('names').value = names;
  names = names.split(',');

  const request = new XMLHttpRequest();
  request.open('GET', 'https://projects.fivethirtyeight.com/nfl-api/2019/leaderboard.json');
  request.responseType = 'json';
  request.onload = function() {
    const data = request.response;
    let counter = 0;
    data.forEach(function(element) {
      if (names.includes(element.name)) {
        const tableBodyRef = document.getElementById('leaderboard').getElementsByTagName('tbody')[0];
        let newRow = tableBodyRef.insertRow(tableBodyRef.rows.length);
        let newCell = newRow.insertCell(0);
        if (counter % 2) {
          newRow.className = 'odd';
        }
        newCell.appendChild(document.createTextNode(element.rank));
        newCell = newRow.insertCell(1);
        newCell.appendChild(document.createTextNode(element.name));
        newCell = newRow.insertCell(2);
        newCell.appendChild(document.createTextNode(element.points));
        newCell = newRow.insertCell(3);
        newCell.appendChild(document.createTextNode(element.percentile));
        counter++;
      }
    });
  };
  request.send();
}

const b = document.getElementById('sub');
b.onclick = leaderboard.updateUrl;

document.getElementById('names').addEventListener('keyup', function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    document.getElementById('sub').click();
  }
});
