const fetchData = (cb)=>{
    fetch('http://localhost:3000/tools', {
        method: 'GET', // or 'PUT'
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(function(res){ return res.json()}).then(function(data){
        cb(data[0].Tools)
    })
}

const getCircularReplacer = () => {
    const seen = new WeakSet()
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return
            }
            seen.add(value)
        }
        return value
    }
}
const postData =async ({url = '', data = {}})=> {
    if(url == '')
        url='http://localhost:3000/print'
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body:JSON.stringify(data, getCircularReplacer()) // body data type must match "Content-Type" header
    })
    return await response.json() // parses JSON response into native JavaScript objects
}
export { postData,fetchData }