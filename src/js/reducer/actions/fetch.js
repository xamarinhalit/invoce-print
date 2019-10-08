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
    data.Tables =data.Tables.map(x=>{
        return {
            Index:x.Index,
            key:x.key,
            children:x.children.map(y=>{
                return {
                    Index:y.Index,
                    value:y.value,
                    Sort:y.Sort,
                    ToolValue:y.ToolValue,
                    menuindex:y.menuindex
                }
            }),
            childIndex:x.childIndex,
            ColumIndex:x.ColumIndex,
            RowIndex:x.RowIndex,
            value:x.value,
            Sort:x.Sort
        }
    })
    data.Menu =data.Menu.map(x=>{
        return {
            Index:x.Index,
            ToolValue:x.ToolValue,
            value:x.value,
            Sort:x.Sort
        }
    })
    data.Clons =data.Clons.map(x=>{
        return {
            Index:x.Index,
            ToolValue:x.ToolValue,
            value:x.value,
            Sort:x.Sort,
            menuindex:x.menuindex
        }
    })
    data = JSON.stringify(data, getCircularReplacer())
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
        body:data // body data type must match "Content-Type" header
    })
    return await response.json() // parses JSON response into native JavaScript objects
}
export { postData,fetchData }