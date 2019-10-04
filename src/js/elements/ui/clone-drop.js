/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { dispatch, addReducer } from '../../../reducer'
import { actionTypes } from '../../../reducer/const.js'
export const makeDraggable = function (target) {
    addReducer.subscribe(actionTypes.INIT.FETCHED, (state, data) => { })
    addReducer.subscribe(actionTypes.CLONE.SETGROUPITEM, SetConfig)
    dispatch({ type: actionTypes.INIT.FETCHED, payload: target })
}
const SetConfig = (state, _data) => {
    const { EmtoPixel } = _data.Tools
    state.UI.$CONTENT
        .droppable({
            accept: '.' + state.UI.DRAGCLASS + '>li',
            classes: {
                'ui-droppable-active': 'ui-state-active',
                'ui-droppable-hover': 'ui-state-hover'
            },
            drop: (event, ui) => {
                // var left = (ui.offset.left - $('.m-Template-Page-Area').offset().left);
                // var top = (ui.offset.top - $('.m-Template-Page-Area').offset().top);
                addReducer.subscribe(
                    actionTypes.CLONE.ADD_CLONEITEM,
                    (_state, cloneItem) => {
                        if (cloneItem != undefined) {
                            //// MY UI DROP
                            const { left: uleft, top: utop } = ui.offset
                            const { left: mleft, top: mtop } = _state.UI.$CONTENT.offset()
                            //let { left: mleft, top: mtop } = _state.UI.$CONTENT.offset();
                            let left = uleft - mleft
                            let top = utop - mtop
                            if (top < 0) top = 0
                            if (left < 0) left = 0
                            _state.UI.$CONTENT.append($(cloneItem.element))
                            $(cloneItem.element).css({ position: 'absolute' })
                            //   $this.append(clel);
                            const textlength = cloneItem.value.ItemValue
                                ? cloneItem.value.ItemValue.length
                                : 10
                            let width = EmtoPixel(10) + 'px',
                                height = ''
                            const tg = textlength / 30
                            if (tg <= 0) {
                                height = EmtoPixel(3) + 'px'
                            } else {
                                height = EmtoPixel((textlength / 30) * 3) + 'px'
                            }

                            $(cloneItem.element)
                                .width(width)
                                .height(height)
                                .offset({ left: left, top: top })
                                .draggable({
                                    containment: _state.UI.DROPID,
                                    cursorAt: {
                                        top: cloneItem.element.offsetY,
                                        left: cloneItem.element.offsetX
                                    },
                                    cursor: 'move',
                                    drag: function (el, ui2) {
                                        cloneItem.value.Style = ui2.helper[0].style.cssText
                                    }
                                })
                                .css({ border: 'none', left: left + 'px', top: top + 'px' })
                                .disableSelection()
                            $(cloneItem.element)
                                .find('i')
                                .click(function (e) {
                                    const { cloneId } = cloneItem.element.dataset
                                    dispatch({
                                        type: actionTypes.CLONE.REMOVE_CLONEITEM,
                                        payload: cloneId
                                    })
                                    // RemoveCloneItem(cloneId);
                                })
                            if ($(cloneItem.element).hasClass('ui-resizable')) {
                                $(cloneItem.element)
                                    .find('.ui-resizable-e')
                                    .remove()
                                $(cloneItem.element)
                                    .find('.ui-resizable-e')
                                    .remove()
                                $(cloneItem.element)
                                    .find('.ui-resizable-se')
                                    .remove()
                            }
                            $(cloneItem.element).resizable({
                                minHeight: width,
                                minWidth: height
                            })
                            cloneItem.value.Style = cloneItem.element.style.cssText
                        }
                    }
                )
                dispatch({
                    type: actionTypes.CLONE.ADD_CLONEITEM,
                    payload: ui.helper[0].dataset.ItemKey
                })
                //dispatch({type:actionTypes.CLONE.ADD_CLONEITEM,payload:_data[0].dataset.ItemKey});
            }
        })
        .disableSelection()
        .css({ margin: '2px' })
}

