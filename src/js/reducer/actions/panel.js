/* eslint-disable no-undef */
import { dispatch, addReducer } from '..'
import { actionTypes } from '../const'

const TableCreate = (litarget)=>{
    const $el =litarget
    if ($el) {
        const elinput = document.createElement('input')
        elinput.setAttribute('type','checkbox')
        $el.prepend(elinput)
        const status={status:true}
        $el.onclick=(_e)=>{
            addReducer.subscribe(actionTypes.CLONE.DRAG_START,()=>{
                status.status=false
            })
            addReducer.subscribe(actionTypes.CLONE.DRAG_STOP,()=>{
                status.status=true
            })
            if(status.status==true){
                let { Index} = $el.dataset
                $el.classList.toggle('active')
                if ($el.classList.contains('active')) {
                    // eslint-disable-next-line no-unused-vars
                    addReducer.subscribe(actionTypes.CLONE.ADD_CLONEITEM,(_xstate,_cloneitem)=>{
                        $el.querySelector('input').checked=true
                    })
                    dispatch({type:actionTypes.CLONE.ADD_CLONEITEM,payload:{Index}})
                } else {
                    // eslint-disable-next-line no-unused-vars
                    addReducer.subscribe(actionTypes.CLONE.REMOVE_TABLEITEM,(_state,_xdata)=>{
                        $el.querySelector('input').checked=false
                    })
                    dispatch({type:actionTypes.CLONE.REMOVE_TABLEITEM,payload:{table:{Index}}})
                }
            }
            
        }
    }
}
const SetGroupItem=(state)=> {
    const { TEXT, TABLE } = state.Clone.Type
    let toolindex= -1
    state.Clone.Items.StaticItems.forEach(function(item) {
        if (item != undefined && item!=null) {
            const { Sort, ToolValue, Items: ItemList } = item
            toolindex =Sort ==undefined ?toolindex+1:Sort
            if (ItemList != undefined && ItemList!=null) {
                const menulength =ItemList.length
                for (let iindex = 0; iindex < menulength; iindex++) {
                    const menuitem = ItemList[iindex]
                    if (menuitem != undefined && menuitem!=null) {
                        switch (menuitem[TEXT.ITEMTYPE]) {
                        case TEXT.FIELD:
                            AddGroupForPanel(menuitem,TEXT,{Sort:toolindex,ToolValue},state)
                            break
                        case TABLE.FIELD:
                            // eslint-disable-next-line no-case-declarations
                            const { li ,className}= AddGroupForPanel(menuitem,TABLE,{Sort:toolindex,ToolValue,menulength},state)
                            if(state.Clone.GroupItems[toolindex]==undefined)
                                state.Clone.GroupItems[toolindex]='.'+className
                            TableCreate(li)
                            break
                        case TEXT.CUSTOMTEXT:
                            AddGroupForPanel(menuitem,TEXT,{Sort:toolindex,ToolValue},state)
                            break
                        case TEXT.CUSTOMIMAGE:
                            AddGroupForPanel(menuitem,TEXT,{Sort:toolindex,ToolValue},state)
                            break
                        default:
                            break
                        }
                    }
                }
               
            }
        }
    })
    $('.'+state.UI.TABLE.CLASSNAME).PanelGroup(state.UI.PANEL.config,state)
}
const AddGroupForPanel= function(value ,o,s,state) {
    const { Clone}  = state
    state.UI.PANEL.Index++
    let groupNameId = 'menu-panel-' + state.UI.PANEL.Index
    const li = document.createElement('li')
    li.dataset.Index=state.UI.PANEL.Index
    li.style.cursor='pointer'
    const lii=document.createElement('i')
    lii.className=value[o.ICON]
    li.appendChild(lii)
    li.innerHTML+=value[o.ITEMTITLE]
    if (Clone.GroupItems[s.Sort] == undefined) {
        const div = document.createElement('div')
        div.className=state.UI.TABLE.CLASSNAME
        const h2 = document.createElement('h2')
        h2.innerText=s.ToolValue
        const upi = document.createElement('i')
        h2.appendChild(upi)
        div.appendChild(h2)
        const ul = document.createElement('ul')
        ul.onmousedown=()=>false
        ul.style.display='block'
        ul.classList.add(groupNameId)
        ul.classList.add(state.UI.DRAGCLASS)
        upi.className=state.UI.PANEL.config.panelupclass
        ul.appendChild(li)
        div.appendChild(ul)
        document.querySelector(state.UI.PANEL.config.container).appendChild(div)
        Clone.GroupItems[s.Sort]='.'+groupNameId
       
    }else {
        document.querySelector( Clone.GroupItems[s.Sort]).appendChild(li)
    }
    if(value.ItemType!=state.Clone.Type.TABLE.FIELD){
        li.dataset.columnIndex=value.ColumnIndex
        $(li).draggable({
            helper: 'clone',
            revert: 'invalid',
            cursor: 'move',
            cancel: null,
            cursorAt: { top: 50, left: 50 }
        }).disableSelection()
    }else{
    
        $('.'+groupNameId).sortable({
            containment:'.'+groupNameId,
            start:(event,ui)=>{
                dispatch({type:actionTypes.CLONE.DRAG_START})
            },
            stop:( event, ui )=>{
                let parents =ui.item[0].parentNode
                for (let j = 0; j < parents.children.length; j++) {
                    const $el = parents.children[j]
                    $el.dataset.columnIndex=j
                    let { Index} = $el.dataset
                    if ($el.classList.contains('active')) {
                        addReducer.subscribe(actionTypes.CLONE.REMOVE_TABLEITEM,(_state,_xdata)=>{
                            addReducer.subscribe(actionTypes.CLONE.ADD_CLONEITEM,(_xstate,_cloneitem)=>{
                                // eslint-disable-next-line no-unused-vars
                            })
                            dispatch({type:actionTypes.CLONE.ADD_CLONEITEM,payload:{Index,Column:{Style:_xdata.style}}})
                        })
                        dispatch({type:actionTypes.CLONE.REMOVE_TABLEITEM,payload:{table:{Index}}})
                        // eslint-disable-next-line no-unused-vars
                    } 
                }
                setTimeout(()=>{
                    dispatch({type:actionTypes.CLONE.DRAG_STOP})
                  
                },1000)
            }
        })
    }
       
    state.UI.PANEL.Menu.push({
        Index:state.UI.PANEL.Index,
        element:li,
        value:value,
        Sort:s.Sort,
        ToolValue:s.ToolValue
    })
    return { li, className:groupNameId}
}
/* eslint-disable no-undef */
$.fn.extend({
    ReloadPanel: function(options, e,state) {
        const { up, down } = options
        let $children = $(this)
        const ilist = []
        for (let i = 0; i < $children.length; i++) {
            const v = $children[i]
            if (v != undefined) {
                if (e != null) {
                    const _$ul =$(e.querySelector('ul'))
                    state.UI.PANEL.Menu.forEach(item => {
                        if(ilist.indexOf(item.Sort)==-1){
                            const $ul =$(item.element.parentNode)
                            const $i =$($ul[0].previousSibling.querySelector('i'))
                            if($ul[0].className == _$ul[0].className){
                                if($i.hasClass(down))
                                {
                                    $ul.css('display','none')
                                    $i.removeClass(down)
                                    $i.addClass(up)
                                }else{
                                    $ul.css('display','block')
                                    $i.removeClass(up)
                                    $i.addClass(down)
                                }
                                ilist.push(item.Sort)
                            }else if($i.hasClass(down))
                            {
                                $ul.css('display','none')
                                $i.removeClass(down)
                                $i.addClass(up)
                                ilist.push(item.Sort)
                            }
                        }
                    })
                } else {
                    state.UI.PANEL.Menu.forEach(item => {
                        if(ilist.indexOf(item.Sort)==-1){
                            const $ul =$(item.element.parentNode)
                            const $i =$($ul[0].previousSibling.querySelector('i'))
                            $ul[0].style.display='none'
                            if($i.hasClass(down))
                            {
                                $i.addClass(up)
                                $i.removeClass(down)
                                ilist.push(item.Sort)
                            }
                        }
                    })
                }
            }
        }
    },
    PanelGroup: function(options,state) {
        let $t = $(this)
        $t.ReloadPanel(options,null,state)
        $t.find('h2').click(function(e) {
            let $el=$(e.currentTarget)
            let $ed=$el.parents('div.'+state.UI.PANEL.config.panelclass)
            $t.ReloadPanel(options,$ed[0],state)
        })
    }
})



export default SetGroupItem