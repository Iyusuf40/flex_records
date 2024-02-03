function changeValueInNestedObj(obj, path, value) {
    let propsList = path.split(".")
    let propsLen = propsList.length
    
    if (propsLen === 1) {
        obj[path] = value
        return
    }

    let tmp = null 
    for (const prop of propsList.slice(0, propsLen - 1)) {
        if (tmp === null) tmp = obj[prop]
        else tmp = tmp[prop]
    }
    tmp ? tmp[propsList[propsLen - 1]] = value : tmp
}

let x = {a: {b: 1}}

changeValueInNestedObj(x, "b", 2)
console.log(x)