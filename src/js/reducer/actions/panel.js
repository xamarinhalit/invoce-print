/* eslint-disable no-undef */
require('../plugins/panelgroup')
const SetGroupItem=(state)=> {
    
    const { TEXT, TABLE } = state.Clone.Type
    const TableGroup=[]

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
                            if(state.Clone.GroupItems[Sort]==undefined){
                                state.Clone.GroupItems[Sort]=
                                '.'+ AddGroupForPanel(element,TABLE,{Sort,ToolValue},state)
                                TableGroup.push(state.Clone.GroupItems[Sort])
                            }else{
                                AddGroupForPanel(element,TABLE,{Sort,ToolValue},state)
                            }
                           
                            break
                        default:
                            break
                        }
                    }
                }
               
            }
        }
    })

    //$('ul.m-drag-ul').disableSelection()
    $('ul.m-drag-ul>li')
        .draggable({
            helper: 'clone',
            revert: 'invalid',
            cursor: 'move',
            cancel: null,
            cursorAt: { top: 50, left: 50 }
        })
        .disableSelection()
    for (let i = 0; i < TableGroup.length; i++) {
        const element = TableGroup[i]
        let $element = $('ul.m-drag-ul' + element + '>li')
        $element.draggable('option', 'disabled', true)
        $element.TableCreate()
    }
    $('.m-Tool').PanelGroup({
        up: 'fa-chevron-up',
        down: 'fa-chevron-down',
        extclass: 'h2',
        activeClass: 'active'
    })
}
const AddGroupForPanel= function(element ,o,s,state) {
    const { GroupItems}  = state.Clone
    let groupNameId = 'group-drop-text-' + element[o.TABLEKEY]
    const li = document.createElement('li')
    li.dataset.ItemKey= element[o.ITEMKEY]
    li.dataset.TableKey=element[o.TABLEKEY]
    li.onmousedown=(e)=>false
    li.style.cursor='pointer'
    const lii=document.createElement('i')
    lii.className=element[o.ICON]
    li.appendChild(lii)
    li.innerHTML+=element[o.ITEMTITLE]
    if (GroupItems[s.Sort] == undefined) {
        const div = document.createElement('div')
        div.className='m-Tool'
        const h2 = document.createElement('h2')
        h2.innerText=s.ToolValue
        const upi = document.createElement('i')
        h2.appendChild(upi)
        div.appendChild(h2)
        const ul = document.createElement('ul')
        ul.onmousedown=(e)=>false
        ul.className='m-drag-ul '+groupNameId
        ul.style.display='block'
        upi.className='fa fa-chevron-up'
        ul.appendChild(li)
        div.appendChild(ul)
        document.querySelector('.m-Template-Tools').appendChild(div)
        GroupItems[s.Sort]='.'+groupNameId
    }else {
        document.querySelector(GroupItems[s.Sort]).appendChild(li)
    }
    return groupNameId
}
export default SetGroupItem