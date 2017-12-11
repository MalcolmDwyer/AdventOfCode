const rangePrinter = (_list) => {
  let list = _list.toJS();
  let parts = [];
  let inSeq = false;
  let dir = 1;
  let prev;
  for (var i = 0; i < list.length; i++) {
    // let dirDash = (dir == 1) ? '⦨' : '⦪'
    let dirDash = '---'
    if (i == list.length - 1) {
      if (inSeq) {
        if (prev + dir == list[i]) {
          parts[parts.length - 1] = parts[parts.length - 1] + `${dirDash}${list[i]}`
        }
        else {
          parts[parts.length - 1] = parts[parts.length - 1] + `${dirDash}${prev}, ${list[i]}`
        }
      }
      else {
        parts.push(list[i])
      }
    }
    else if (inSeq) {
      if (prev + dir == list[i]) {
        // continue list

      }
      else {
        // end list, write new val
        parts[parts.length - 1] = parts[parts.length - 1] + `${dirDash}${prev}, ${list[i]}`
        inSeq = false;
      }
    }
    else {
      if (list[i] == prev + 1) {
        inSeq = 1
        dir = 1
      }
      else if (list[i] == prev - 1) {
        inSeq = 1
        dir = -1
      }
      else {
        parts.push(list[i])
      }
    }
    prev = list[i]
  }
  return parts.join(', ')
}

module.exports = {rangePrinter}
