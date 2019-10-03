/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { fn } from './../tool/screen.js'

import { SetItems } from './clone-module'
import { dispatch, addReducer } from '../../../reducer'
import { actionTypes } from '../../../reducer/const.js'
export const UISELECT = {
    DRAGCLASS: 'm-drag-ul',
    ACCORDIONID: '#accordion',
    DROPID: '',
    $CONTENT: null
}
export const makeDraggable = function (target) {
    UISELECT.DROPID = target
    UISELECT.$CONTENT = $(target)
    addReducer.subscribe(actionTypes.INIT.FETCHED, (state, data) => {
        console.log(actionTypes.INIT.FETCHED, state, 'DATA', data)
        SetItems(state.Clone.Items.StaticItems)
    })
    addReducer.subscribe(actionTypes.CLONE.SETGROUPITEM, SetConfig)
    dispatch({ type: actionTypes.INIT.FETCHED, payload: target })
}
const SetConfig = (state, _data) => {
    console.log(actionTypes.CLONE.SETGROUPITEM, state, 'DATA', state)
    const { EmtoPixel } = fn
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
export const Tools = {
    screen: {
        width: {
            big: 0,
            medium: 0.0,
            smal: 0,
            bigpercent: 0,
            smallpercent: 0
        },
        height: {
            big: 0,
            medium: 0.0,
            smal: 0,
            bigpercent: 0,
            smallpercent: 0
        }
    },
    GetInitCalc: function () {
        const { screen } = Tools
        const { vwTOpx, vhTOpx } = fn
        const { height, width } = screen
        let {
            width: medwidth,
            height: medheight
        } = UISELECT.$CONTENT[0].getClientRects()[0]
        width.big = vwTOpx('98')
        width.medium = medwidth / 100
        width.smal = vwTOpx('80')
        width.smallpercent = width.smal / 100
        width.bigpercent = width.big / 100
        height.big = vhTOpx('98')
        height.medium = medheight / 100
        height.smal = vhTOpx('70')
        height.smallpercent = height.smal / 100
        height.bigpercent = height.big / 100
    },
    CalcW80To100: function (left, width) {
    //   if(width=='')
    //     width='1';
        const { smallpercent, bigpercent, big } = Tools.screen.width
        let value = parseInt(left.replace('px', ''))
        let _width = parseInt(width.replace('px', ''))
        if (value < 0) value = 0
        let smalbody = value / smallpercent
        let largprint = bigpercent * smalbody
        let smalwidth = _width / smallpercent
        let largwidth = smalwidth * bigpercent
        if (smalwidth + smalbody >= 100) {
            return {
                left: 99 - smalwidth,
                width: smalwidth
            }
        }
        return {
            left: smalbody,
            width: smalwidth
        }
    },
    CalcH70To100: function (top, height) {
    // if(height=='')
    //     height='1';
        const { smallpercent, bigpercent, big } = Tools.screen.height
        let value = parseInt(top.replace('px', ''))
        let _height = parseInt(height.replace('px', ''))
        let smalbody = value / smallpercent
        let largprint = bigpercent * smalbody
        let smalheight = _height / smallpercent
        let largheight = smalheight * bigpercent
        if (smalheight + smalbody >= 99) {
            return {
                top: 99 - smalheight,
                height: smalheight
            }
        }
        return {
            top: smalbody,
            height: smalheight
        }
    }
}
