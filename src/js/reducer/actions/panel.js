/* eslint-disable no-undef */
require('../plugins/panelgroup')
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
                            $(li).draggable('option', 'disabled', true)
                                .TableCreate()
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
    // li.classList.add(state.UI.DRAGCLASS)
    // li.dataset.ItemKey= element[o.ITEMKEY]
    // li.dataset.TableKey=element[o.TABLEKEY]
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
export default SetGroupItem