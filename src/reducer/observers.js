 import  state from './state'
export const reducer ={
    observers: []
  ,subscribe: function(ob) {
      this.observers.push(ob)
    }
  , remove: function(observer) {
      let index = this.observers.indexOf(observer)
      if (~index) {
        this.observers.splice(index, 1)
      }
    }
  , send: function(obj=null) {// {type:actionTypes, payload:{}}
      for (let i = this.observers.length - 1; i >= 0; i--) {
          if(obj==null){
            this.observers[i].fn();
            this.remove(this.observers[i])
          }else{
              const item=this.observers[i];
              if(item.type==obj.type){
                item.fn(state,obj.payload);
                // this.remove(this.observers[i]);
              }
          }
        
      };
    }
  }