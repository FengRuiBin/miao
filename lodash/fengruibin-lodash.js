//Lodash
var fengruibin = function () {

  function chunk(array, size) {
    let res = []
    if (!array || size < 1) return result
    for (let i = 0; i < array.length; i += size) {
      res.push(array.slice(i, i + size))
    }
    return res
  }


  function compact(array) {
    var res = []
    for (let i = 0; i < array.length; i++) {
      if (array[i]) {
        res.push(array[i])
      }
    }
    return res
  }


  function concat(array, ...values) {
    let res = []
    for (let i = 0; i < array.length; i++) {
      res.push(array[i])
    }
    for (let j = 0; j < values.length; j++) {
      if (Array.isArray(values[j])) {
        for (let k = 0; k < values[j].length; k++) {
          res.push(values[j][k])
        }
      } else {
        res.push(values[j])
      }
    }
    return res
  }


  function difference(array, values) {
    let res = []
    let nres = values.flat(Infinity)
    for (let i = 0; i < array.length; i++) {
      if (!nres.includes(array[i])) {
        res.push(array[i])
      }
    }
    return res
  }


  function differenceBy(array, values, iteratee) {

  }


  function drop(array, n) {
    let res = []
    for (let i = n; i < array.length; i++) {
      res.push(array[i])
    }
    return res
  }


  function dropRight(array, n) {
    let res = []
    if (n > array.length) return res
    for (let i = 0; i < array.length - n; i++) {
      res.push(array[i])
    }
    return res
  }


  //调用函数
  return {
    chunk: chunk,
    compact: compact,
    concat: concat,
    difference: difference,
    differenceBy: differenceBy,
    drop: drop,
    dropRight: dropRight,
  }
}()
