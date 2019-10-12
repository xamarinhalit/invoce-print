const fetchData = (url ,cb)=>{
    fetch(url, {
        method: 'GET', // or 'PUT'
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(function(res){ return res.json()}).then(function(data){
        cb(data)
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
  //  data = JSON.stringify(data, getCircularReplacer())
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
        body:JSON.stringify(data) // body data type must match "Content-Type" header
    })
    return await response.json() // parses JSON response into native JavaScript objects
}
export { postData,fetchData }