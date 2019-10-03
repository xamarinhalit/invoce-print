import InitialState from './state';
import { actionTypes } from './const'
import { SetGroupItem, fetchData, AddCloneItem, RemoveCloneItem } from './actions';
import { CreateTable } from './actions/add-clone';

const observers= [];

const dispatch = (action,state=InitialState)=>{

    switch (action.type) {
        case actionTypes.CLONE.SETGROUPITEM:
            SetGroupItem(state);
            sendReducer(action.type,null,state);
            break;
        case actionTypes.INIT.FETCHED:
            fetchData(data=>{
                state.Clone.Items.StaticItems=data;
                state.UI.DROPID=action.payload;
                state.UI.$CONTENT = $(action.payload);
                sendReducer(action.type,data,state);
                dispatch({type:actionTypes.CLONE.SETGROUPITEM});
            })
            break;
        case actionTypes.CLONE.ADD_CLONEITEM:
            AddCloneItem(action.payload,state,data=>{
                console.log("addcloneitem",state);
                sendReducer(action.type,data,state);
            });
        break;
        case actionTypes.CLONE.REMOVE_CLONEITEM:
            RemoveCloneItem(action.payload,state,data=>{
                sendReducer(action.type,data,state);
            })
            break;
        case actionTypes.CLONE.CREATE_TABLE:
            CreateTable(state).then((_data)=>{
                sendReducer(action.type,_data,state);
            })
        break;
        default:
            break;
    }


}
const sendReducer= (type,data,state)=> {// {type:actionTypes, payload:{}}
    for (let i = observers.length - 1; i >= 0; i--) {
        if(!type){
            observers[i].fn();
            //addReducer.unSubscribe(observers[i])
        }else{
            const item=observers[i];
            if(item.type==type){
                if(item.fn!=undefined)
                    item.fn(state,data);
                addReducer.unSubscribe(item)
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