const db = {
  list: []
}

function getData() {
  return db.list
}

function saveData(item) {
  db.list.push(item)
}

module.exports = {
  getData,
  saveData
}
