/* eslint-disable no-undef */
require('../../plugins/panelgroup')
const SetGroupItem=(state)=> {
    
    const { TEXT, TABLE } = state.Clone.Type
    let AddedGroup = {}

    state.Clone.Items.StaticItems.forEach(function(item) {
        if (item != undefined) {
            const { Sort, ToolValue, Items: ItemList } = item
            if (ItemList != undefined) {
                for (let iindex = 0; iindex < ItemList.length; iindex++) {
                    const element = ItemList[iindex]
                    if (element != undefined) {
                        switch (element.ItemType) {
                        case TEXT.FIELD:
                            AddGroupTextFieldItem({
                                name: element[TEXT.ITEMKEY],
                                value: element[TEXT.ITEMTITLE],
                                item_sort: Sort,
                                ItemType: element.ItemType,
                                groupName: ToolValue,
                                icon: element.Icon
                            },state)
                            break
                        case TABLE.FIELD:
                            AddedGroup[item.ItemType] = {
                                group: AddGroupTextFieldItem({
                                    name: element[TEXT.ITEMKEY],
                                    value: element[TEXT.ITEMTITLE],
                                    item_sort: Sort,
                                    ItemType: element.ItemType,
                                    groupName: ToolValue,
                                    icon: element.Icon
                                },state)
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

    $('ul.m-drag-ul').disableSelection()
    $('ul.m-drag-ul>li')
        .draggable({
            helper: 'clone',
            revert: 'invalid',
            cursor: 'move',
            cancel: null,
            cursorAt: { top: 50, left: 50 }
        })
        .disableSelection()
    let keys = Object.keys(AddedGroup)
    for (let i = 0; i < keys.length; i++) {
        const element = AddedGroup[keys[i]]
        let $element = $('ul.m-drag-ul.' + element.group + '>li')
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
const AddGroupTextFieldItem= function(options,state) {
    const { GroupItems}  = state.Clone
    const { name, value, item_sort, groupName, icon } = options
    let groupNameId = 'group-drop-text-' + item_sort
    if (GroupItems[groupNameId] == undefined) {
        GroupItems[groupNameId] = item_sort
        $('.m-Template-Tools').append(`
                <div class="m-Tool">
                    <h2> ${groupName} <i class="fa fa-chevron-up"></i> </h2>
                    <ul class="m-drag-ul ${groupNameId}" style='display:block'>
                    </ul>
                </div>`)
    }
    $('ul.m-drag-ul.' + groupNameId)
        .append(`<li class="" data--item-key="${name}" >
                            <i class="${icon}"></i>${value}</li>`)
    return groupNameId
}
export default SetGroupItem