/* eslint-disable no-undef */
import { dispatch, addReducer } from '..'
import { actionTypes } from '../const'

const TableCreate = (litarget)=>{
    const $el =litarget
    if ($el) {
        const elinput = document.createElement('input')
        elinput.setAttribute('type','checkbox')
        $el.prepend(elinput)
        $el.onclick=(e)=>{
            // const $item = $($el)
            let { Index} = $el.dataset
            $el.classList.toggle('active')
            if ($el.classList.contains('active')) {
                // eslint-disable-next-line no-unused-vars
                addReducer.subscribe(actionTypes.CLONE.ADD_CLONEITEM,(__state,_cloneitem)=>{
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
const SetGroupItem=(state)=> {
    const { TEXT, TABLE } = state.Clone.Type
    const liClassName='m-Tool'
    state.Clone.Items.StaticItems.forEach(function(item) {
        if (item != undefined) {
            const { Sort, ToolValue, Items: ItemList } = item
            if (ItemList != undefined) {
                for (let iindex = 0; iindex < ItemList.length; iindex++) {
                    const element = ItemList[iindex]
                    if (element != undefined) {
                        switch (element[TEXT.ITEMTYPE]) {
                        case TEXT.FIELD:
                            AddGroupForPanel(element,TEXT,{Sort,ToolValue},state)
                            break
                        case TABLE.FIELD:
                            const { li ,className}= AddGroupForPanel(element,TABLE,{Sort,ToolValue},state)
                            if(state.Clone.GroupItems[Sort]==undefined)
                                state.Clone.GroupItems[Sort]='.'+className
                            TableCreate(li)
                            $(li).draggable('option', 'disabled', true)
                                
                            break
                        default:
                            break
                        }
                    }
                }
               
            }
        }
    })
    $('.'+liClassName).PanelGroup(state.UI.PANEL.config,state)
}
const AddGroupForPanel= function(element ,o,s,state) {
    const { Clone}  = state
    state.UI.PANEL.Index++
    const liClassName='m-Tool'
    const panelupClassName='fa fa-chevron-up'
    const panelContainer='.m-Template-Tools'
    let groupNameId = 'menu-panel-' + state.UI.PANEL.Index
    const li = document.createElement('li')
    li.dataset.Index=state.UI.PANEL.Index
    li.style.cursor='pointer'
    const lii=document.createElement('i')
    lii.className=element[o.ICON]
    li.appendChild(lii)
    li.innerHTML+=element[o.ITEMTITLE]
    if (Clone.GroupItems[s.Sort] == undefined) {
        const div = document.createElement('div')
        div.className=liClassName
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
        upi.className=panelupClassName
        ul.appendChild(li)
        div.appendChild(ul)
        document.querySelector(panelContainer).appendChild(div)
        Clone.GroupItems[s.Sort]='.'+groupNameId
    }else {
        document.querySelector( Clone.GroupItems[s.Sort]).appendChild(li)
    }
    $(li).draggable({
        helper: 'clone',
        revert: 'invalid',
        cursor: 'move',
        cancel: null,
        cursorAt: { top: 50, left: 50 }
    }).disableSelection()
    state.UI.PANEL.Menu.push({
        Index:state.UI.PANEL.Index,
        element:li,
        value:element,
        Sort:s.Sort,
        ToolValue:s.ToolValue
    })
    return { li, className:groupNameId}
}
/* eslint-disable no-undef */
$.fn.extend({
    ReloadPanel: function(options, e,state) {
        // const { up, down, extclass, activeClass } = options
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
            let $ed=$el.parents('div.m-Tool')
            $t.ReloadPanel(options,$ed[0],state)
        })
    }
})



export default SetGroupItem