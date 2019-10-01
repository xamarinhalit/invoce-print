import InitialState from './state';
import { actionTypes } from './const'
import { SetGroupItem, fetchData } from './actions';

const observers= [];

const dispatch = (action,payload,state=InitialState)=>{

    switch (action.type) {
        case actionTypes.CLONE.SETGROUPITEM:
            SetGroupItem(state);
            sendEvents(action.type,null,state);
            break;
        case actionTypes.INIT.FETCHED:
            fetchData(data=>{
                state.Clone.Items.StaticItems=data;
                sendEvents(action.type,data,state);
                dispatch({type:actionTypes.CLONE.SETGROUPITEM});
            })
            break;
        default:
            break;
    }


}
const sendEvents= (type,data,state)=> {// {type:actionTypes, payload:{}}
    for (let i = observers.length - 1; i >= 0; i--) {
        if(!type){
            observers[i].fn();
            //this.remove(observers[i])
        }else{
            const item=observers[i];
            if(item.type==type){
                item.fn(state,data);
            }
        }
        
    };
}
const addReducer ={
    subscribe: function(type,fn) {
        observers.push({type,fn})
        }
    ,
    unSubscribe: function(observer) {
        let index = observers.indexOf(observer)
        if (~index) {
            observers.splice(index, 1)
        }
    }
  }
  export { addReducer,dispatch}