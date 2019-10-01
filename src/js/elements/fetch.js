export const fetched=(cb)=>{
        fetch("http://localhost:3000/tools", {
        method: 'GET', // or 'PUT'
        headers:{
            'Content-Type': 'application/json'
        }
        }).then(function(res){ return res.json();}).then(function(ORNEKJSON){
            cb(ORNEKJSON);
        });
}