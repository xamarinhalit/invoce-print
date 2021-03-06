/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { dispatch, subscribe} from '..'
import { NullCheck, styleToObject } from './convert'
import { actionTypes } from '../const'
const TableCreate = (litarget)=>{
    const $el =litarget
    if ($el) {
        const elinput = document.createElement('input')
        elinput.setAttribute('type','checkbox')
        elinput.onchange=()=>false
        $el.prepend(elinput)
        const status={status:true}
        $el.onclick=(_e)=>{
            subscribe(actionTypes.CLONE.DRAG_START,()=>{
                status.status=false
            })
            subscribe(actionTypes.CLONE.DRAG_STOP,()=>{
                status.status=true
            })
            if(status.status==true){
                let { Index} = $el.dataset
                $el.classList.toggle('active')
                if ($el.classList.contains('active')) {
                    // eslint-disable-next-line no-unused-vars
                    subscribe(actionTypes.CLONE.ADD_CLONEITEM,(_xstate,_cloneitem)=>{
                        $el.querySelector('input').checked=true
                    })
                    dispatch({type:actionTypes.CLONE.ADD_CLONEITEM,payload:{Index}})
                } else {
                    // eslint-disable-next-line no-unused-vars
                    subscribe(actionTypes.CLONE.REMOVE_TABLEITEM,(_state,_xdata)=>{
                        $el.querySelector('input').checked=false
                    })
                    dispatch({type:actionTypes.CLONE.REMOVE_TABLEITEM,payload:{table:{Index}}})
                }
            }
        }
    }
}
const SetGroupItem=(state,_Menu)=> {
    const { TEXT, TABLE } = state.Clone.Type
    _Menu.forEach(function(item) {
        if (item != undefined && item!=null) {
            const {  ToolValue, value } = item
            if (value != undefined && value!=null) {
                switch (value[TEXT.ITEMTYPE]) {
                case TEXT.FIELD:
                    AddGroupForPanel(item,TEXT,state)
                    break
                case TABLE.FIELD:
                    // eslint-disable-next-line no-case-declarations
                    const { li ,className}= AddGroupForPanel(item,TABLE,state)
                    if(state.Clone.GroupItems[value.MenuRowIndex]==undefined)
                        state.Clone.GroupItems[value.MenuRowIndex]='.'+className
                    TableCreate(li)
                    break
                case TEXT.CUSTOMTEXT:
                    AddGroupForPanel(item,TEXT,state)
                    break
                case TEXT.CUSTOMIMAGE:
                    AddGroupForPanel(item,TEXT,state)
                    break
                default:
                    break
                }
            }
            
        }
    })
    $('.'+state.UI.TABLE.CLASSNAME).PanelGroup(state.UI.PANEL.config,state)
}
const SetGroupItemOriginal=(state)=> {
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

const AddGroupForPanel= function(item,o ,state) {
    const { value, ToolValue} =item
    const { Clone}  = state
    // state.UI.PANEL.Index++
    let groupNameId = 'menu-panel-' +item.id
    const li = document.createElement('li')
    li.dataset.Index=item.id
    li.style.cursor='pointer'
    const lii=document.createElement('i')
    lii.className=value[o.ICON]
    li.appendChild(lii)
    li.innerHTML+=value[o.ITEMTITLE]
    if (Clone.GroupItems[value.MenuRowIndex] == undefined) {
        const div = document.createElement('div')
        div.className=state.UI.TABLE.CLASSNAME
        const h2 = document.createElement('h2')
        h2.innerText=ToolValue
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
        Clone.GroupItems[value.MenuRowIndex]='.'+groupNameId
       
    }else {
        document.querySelector( Clone.GroupItems[value.MenuRowIndex]).appendChild(li)
    }
    if(value.ItemType!=state.Clone.Type.TABLE.FIELD){
        $(li).draggable({
            helper: 'clone',
            revert: 'invalid',
            cursor: 'move',
            cancel: null,
            cursorAt: { top: 50, left: 50 }
        }).disableSelection()
    }else{
        li.dataset.columnIndex=value.ColumnIndex
        $('.'+groupNameId).sortable({
            containment:'.'+groupNameId,
            start:(_event,_ui)=>{
                dispatch({type:actionTypes.CLONE.DRAG_START})
            },
            stop:( _event, ui )=>{
                let parents =ui.item[0].parentNode
                let i =0
                GetMenuValue(parents.children,i,{Menu: state.UI.PANEL.Menu},state,()=>{
                    dispatch({type:actionTypes.CLONE.DRAG_STOP})
                })
            }
        })
    }
    
    state.UI.PANEL.Menu.push({
        ...item,
        element:li,
    })
    return { li, className:groupNameId}
}
const GetMenuValue = ($chilren,j,{Menu},state,success)=>{
    if($chilren.length>j){
        const $el = $chilren[j]
        let { Index:id} = $el.dataset
        for (let i = 0; i < Menu.length; i++) {
            const item = Menu[i]
            if(item!=undefined){
                if(item.id==id && item.value.ColumnIndex!=j){
                    $el.dataset.columnIndex=j
                    item.value.ColumnIndex=j
                }
            }
        }
        if ($el.classList.contains('active')) {
            subscribe(actionTypes.CLONE.REMOVE_TABLEITEM,(_state,_xdata)=>{
                if(_xdata!=null){
                    // eslint-disable-next-line no-unused-vars
                    subscribe(actionTypes.CLONE.ADD_CLONEITEM,(_xstate,_cloneitem)=>{
                        j++
                        if($chilren.length>j){
                            GetMenuValue ($chilren,j,{Menu},state,success)
                        }else{
                            success()
                        }
                    })
                    dispatch({type:actionTypes.CLONE.ADD_CLONEITEM,payload:{Index:id,Column:{Style:_xdata.style},Table:_xdata.Table}})
                }
            })
            dispatch({type:actionTypes.CLONE.REMOVE_TABLEITEM,payload:{table:{Index:id}}})
            // eslint-disable-next-line no-unused-vars
        }else{
            j++
            if($chilren.length>j){
                GetMenuValue ($chilren,j,{Menu},state,success)
            }else{
                success()
            }
        }
        
       
    }
}
export const StyleParamClick = ({selector,readselector,defaultvalue})=>{
    $('li[data-'+selector+']').click((e)=>{
        $('li[data-'+selector+']').each((i,ele)=>{
            if(ele!=undefined && e.currentTarget!= ele){
                if(ele.classList.contains('active')){
                    ele.classList.remove('active')
                }
            }
        })
        e.currentTarget.classList.toggle('active')
        const elactive = e.currentTarget.classList.contains('active')
        dispatch({type:actionTypes.CLONE.FONT_CHANGE,payload:{ font:selector,style:e.currentTarget.dataset[readselector],status:elactive,defaultvalue}})
    })
}
const GetCloneItem = (state,cloneId)=>{
    const _item ={
        item:null
    }
    for (let i = 0; i < state.Clone.Items.Clons.length; i++) {
        const item = state.Clone.Items.Clons[i]
        if(item!=undefined && item.Index==cloneId){
            _item.item=item
            break
        }
        
    }
    return _item
}
export const ChangeFontEvent = (state,payload)=>{
    if(NullCheck(payload.font)){
        if(!NullCheck(payload.status)){
            state.UI.SELECT.$font.style[payload.font]=payload.input
        }else if(payload.status==true && NullCheck(payload.style))
            state.UI.SELECT.$font.style[payload.font]=payload.style
        else 
            state.UI.SELECT.$font.style[payload.font]=payload.defaultvalue
        if( NullCheck(state.UI.SELECT.$font)){
            const parent =$(state.UI.SELECT.$font).parents('.'+state.UI.TABLEMAINCLASS)
            if(parent.length==0){
                const { cloneId } =  state.UI.SELECT.$font.dataset
                const { item } = GetCloneItem(state,cloneId)
                item.value.Style=styleToObject( state.UI.SELECT.$font)
            }else{
                const className='.'+ state.UI.SELECT.$font.className
                    .replace(' '+state.UI.FIELDCLASS,'').replace(' '+state.UI.TABLECOLUMNCLASS,' ')
                    .replace(' ui-resizable active','').replace(' ','.')
                parent.find(className).each((ii,ix)=>{
                    if(ix!=undefined){
                        const { cloneId } = ix.dataset
                        const { item } = GetCloneItem(state,cloneId)
                        ix.style.cssText=state.UI.SELECT.$font.style.cssText
                        item.value.Style=styleToObject(ix)
                    }
                })
            }
          

        }
    }
}

/* eslint-disable no-undef */
$.fn.extend({
    ReloadPanel: function(options, e,state) {
        const { up, down } = options
        let $children = $(this)
        const ilist = []
        const Islist = (ToolValue)=>{
            ilist.map(x=>{
                if(x.ToolValue == ToolValue)
                    return true
            })
            return ilist.length==0
        }
        for (let i = 0; i < $children.length; i++) {
            const v = $children[i]
            if (v != undefined) {
                if (e != null) {
                    const _$ul =$(e.querySelector('ul'))
                    state.UI.PANEL.Menu.forEach(item => {
                      
                        if(Islist(item.ToolValue)){
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
                                ilist.push({ToolValue:item.ToolValue})
                            }else if($i.hasClass(down))
                            {
                                $ul.css('display','none')
                                $i.removeClass(down)
                                $i.addClass(up)
                                // ilist.push(item.Sort)
                            }
                        }
                    })
                } else {
                    state.UI.PANEL.Menu.forEach(item => {
                        if(Islist(item.ToolValue)){
                            const $ul =$(item.element.parentNode)
                            const $i =$($ul[0].previousSibling.querySelector('i'))
                            $ul[0].style.display='none'
                            if($i.hasClass(down))
                            {
                                $i.addClass(up)
                                $i.removeClass(down)
                                // ilist.push(item.Sort)
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