/* eslint-disable no-undef */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import '../_plugin/css/bootstrap.min.css'
import '../_plugin/css/font-awesome.min.css'
import '../_plugin/css/jquery-ui.min.css'
// import '../scss/efar.scss';
//import '../scss/mydrop.scss'
import '../scss/mycss.scss'
// import '../_plugin/css/jq-ui.css'

import { addReducer, dispatch ,reducer_pipe} from './reducer'
import { actionTypes } from './reducer/const'

(function () {
    require('../_plugin/js/used/printThis.js')
    require('../_plugin/js/used/bootstrap.min.js')

    require('webpack-jquery-ui')
    const { subscribe } =addReducer
    //require('webpack-jquery-ui/css');
    $(document).ready(function () {
        const InitDragable = function (target,...args) {
            for (let i = 0; i < args.length; i++) $(args[i].id).click(()=>$(this)[args[i].fn]())
            subscribe(actionTypes.INIT.FETCHED, (state, data) => { })
            dispatch({ type: actionTypes.INIT.FETCHED, payload: target })
        }
        $.fn.extend({
            makePrint: function() {
                subscribe(actionTypes.UI.UI_GETINITCALC,(state,_data)=>{
                    const { screen } = state.UI
                    const {  CalcW80To100, CalcH70To100 } = _data.Tools
                    const _pr =$(state.UI.DROPID).clone()
                    reducer_pipe(
                        _pr,
                        (t)=>{
                            let i = t[0].classList.length
                            for (let index = 0; index < i; index++) {
                                t[0].classList.remove( t[0].classList[index])
                            }
                        },
                        (t)=>t.find('.close').remove(),
                        (t)=>t.find('.ui-resizable-handle.ui-resizable-e').remove(),
                        (t)=>t.find('.ui-resizable-handle.ui-resizable-s').remove(),
                        (t)=>t.find('.ui-resizable-handle.ui-resizable-se').remove(),
                        (t)=>{
                            t.find('.TextField').each(function(i, item) {
                                if (item != undefined) {
                                    reducer_pipe(item.style,
                                        (style)=>{
                                            let { left, width } = CalcW80To100(style.left, style.width,screen)
                                            let { top, height } = CalcH70To100(style.top, style.height,screen)
                                            if (left <= 0) left = 0
                                            style.left=JSON.stringify(left) + 'vw'
                                            style.width=JSON.stringify(width) + 'vw'
                                            style.height= JSON.stringify(top) + 'vh'
                                            style.top=JSON.stringify(height) + 'vh'
                                            $(item).text($(item).text().trim())
                                        }
                                    )
                                }
                            })
                        },
                        (t)=>{
                            let tablefield = t.find('#TableField')
                            if (tablefield != undefined && tablefield.length>0) {
                                let $tablefield = tablefield[0]
                                let $s=$tablefield.style
                                let { left, width } = CalcW80To100($s.left,$s.width,screen)
                                let { top, height } = CalcH70To100($s.top,$s.height,screen)
                                if (left <= 0) left = 0
                                
                                $s.left = JSON.stringify(left) + 'vw'
                                $s.width = JSON.stringify(width) + 'vw'
                                $s.top = JSON.stringify(top) + 'vh'
                                $s.height = JSON.stringify(height) + 'vh'
                            }
                        },
                        (t)=>{
                            var newwin = window.open('')
                            newwin.document.write(`<html><head>
                            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                            <link rel="stylesheet" href="src/css/mycss.css">
                            <link rel="stylesheet" href="src/css/jq-ui.css">
                            <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"> <link href="https://content.hesap365.com/static/css/jquery-ui.min.css" rel="stylesheet">
                            <link rel="stylesheet" href="src/css/print-css.css">
                            </head><body>
                                    <div style="display: block;width:99vw;height:99vh">
                                        <div style="margin-top: 1em">
                                            ${t[0].innerHTML}
                                        </div>
                                    </div></body></html>`)
                    
                            newwin.focus()
                            $(newwin.document.body).printThis({
                                debug: false, // show the iframe for debugging
                                importCSS: true, // import parent page css
                                importStyle: true, // import style tags
                                printContainer: true, // print outer container/$.selector
                                pageTitle: '', // add title to print page
                                removeInline: false, // remove inline styles from print elements
                                removeInlineSelector: '*', // custom selectors to filter inline styles. removeInline must be true
                                printDelay: 333, // variable print delay
                                header: '', // prefix to html
                                footer: null, // postfix to html
                                base: false, // preserve the BASE tag or accept a string for the URL
                                formValues: true, // preserve input/form values
                                canvas: false, // copy canvas content
                                removeScripts: false, // remove script tags from print content
                                copyTagClasses: true, // copy classes from the html & body tag
                                beforePrintEvent: null, // function for printEvent in iframe
                                beforePrint: null, // function called before iframe is filled
                                afterPrint: null // function called before iframe is removed
                            })
                            newwin.close()
                        }
                    )
                })
                dispatch({type:actionTypes.UI.UI_GETINITCALC})
            
            }, 
            loadPrint: function() {
                // eslint-disable-next-line no-unused-vars
                subscribe(actionTypes.UI.UI_GETINITCALC,(state,_data)=>
                {
                    const Clons =state.Clone.Items.Clons
                    const CloneType = state.Clone.Type
                    const { width, height } = state.UI.screen
                    let div = '<div style="display: block;width:100vw;height:99vh"><div style="">'
                    let tablerow = []
                    let elementrow = []
                    let table = null
                    for (let i = 0; i < Clons.length; i++) {
                        const { value, element } =  Clons[i]
                        let left = $(element).css('left')
                        let top = $(element).css('top')
                        top = top.replace('px', '')
                        left = left.replace('px', '')
                        let leftx = left / width.medium
                        if(leftx>-1)
                            leftx=0
                        let topx = top / height.medium
                        const elementclone = $(element).clone()
                        elementclone.css({ left: leftx + 'vw', top: topx + 'vh', margin: '0px' })
                        elementclone.offset({ left: leftx + 'vw', top: topx + 'vh' })
                        let xstyle
                        switch (value.ItemType) {
                        case CloneType.TABLE.DEFAULT:
                            xstyle = elementclone[0].style.cssText
                            value.Style = xstyle
                            table = value
                            elementrow.push('table')
                            break
                        case CloneType.TABLE.FIELD:
                            tablerow[value.Sort] = value
            
                            break
                        case CloneType.TEXT.FIELD:
                            xstyle = elementclone[0].style.cssText
                            elementrow.push(`<div style="${xstyle}">${value.ItemValue}</div>`)
                            break
                        }
                    }
                    for (let i = 0; i < elementrow.length; i++) {
                        const row = elementrow[i]
                        let rowbody = ''
                        let rowbodygroup = {}
                        let rowCountObj = {}
                        let rowcount = null
                        if (row == 'table') {
                            if (table != null) {
                                for (const key in tablerow) {
                                    if (tablerow.hasOwnProperty(key)) {
                                        const element = tablerow[key]
                                        if (
                                            rowCountObj[element.SubItemKey + element.ItemKey] == undefined
                                        ) {
                                            rowCountObj[element.SubItemKey + element.ItemKey] = 0
                                        } else {
                                            rowCountObj[element.SubItemKey + element.ItemKey]++
                                        }
                                        rowcount = JSON.stringify(
                                            rowCountObj[element.SubItemKey + element.ItemKey]
                                        )
                                        if (rowbodygroup[rowcount] == undefined) {
                                            rowbodygroup[rowcount] = `<tr data-rowgroup="${rowcount}">`
                                        }
            
                                        rowbodygroup[rowcount] += `<td>${element.ItemValue}</td>`
                                    }
                                }
                                for (const key in rowbodygroup) {
                                    if (rowbodygroup.hasOwnProperty(key)) {
                                        const element = rowbodygroup[key]
                                        rowbody += element + '</tr>'
                                    }
                                }
                            }
                            div += `<div style="${table.Style}"><table class="table-style" border="0">
                        <tbody>${rowbody}</tbody>
                        </table>
                        </div>
                        `
                        } else {
                            div += row
                        }
                    }
                    div += '</div></div>'
                    let _html = document.createElement('html')
                    let _head = document.createElement('head')
                    const lnkCreate = (href,integrity)=>{
                        const _linkboots= document.createElement('link')
                        if(integrity!=undefined){
                            _linkboots.integrity=integrity
                            _linkboots.crossOrigin='anonymous'
                        }
                        _linkboots.rel='stylesheet'
                        _head.appendChild(_linkboots)
                    }
                    lnkCreate('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css','sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u')
                    lnkCreate('src/css/mycss.css')
                    lnkCreate('src/css/jq-ui.css')
                    lnkCreate('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css')
                    lnkCreate('https://content.hesap365.com/static/css/jquery-ui.min.css')
                    lnkCreate('src/css/print-css.css')
                    let styles=document.createElement('style')
                    styles.innerHTML=`.table-style{
                        border-width: 0!important;
                        border-right-style: none!important;
                        border-right-width: 0!important;
                        table-layout: fixed!important;
                        width: 100%;
                        }`
                    _head.appendChild(styles)
                    _html.appendChild(_head)
                    let _body = document.createElement('body')
                    _body.innerHTML=div
                    _html.appendChild(_body)
                    $(_html).printThis({
                        debug: false, // show the iframe for debugging
                        importCSS: true, // import parent page css
                        importStyle: true, // import style tags
                        printContainer: true, // print outer container/$.selector
                        pageTitle: '', // add title to print page
                        removeInline: false, // remove inline styles from print elements
                        removeInlineSelector: '*', // custom selectors to filter inline styles. removeInline must be true
                        printDelay: 333, // variable print delay
                        header: '', // prefix to html
                        footer: null, // postfix to html
                        base: false, // preserve the BASE tag or accept a string for the URL
                        formValues: true, // preserve input/form values
                        canvas: false, // copy canvas content
                        removeScripts: false, // remove script tags from print content
                        copyTagClasses: true, // copy classes from the html & body tag
                        beforePrintEvent: null, // function for printEvent in iframe
                        beforePrint: null, // function called before iframe is filled
                        afterPrint: null // function called before iframe is removed
                    })

                })
                dispatch({type:actionTypes.UI.UI_GETINITCALC})
            },
            newPrint: function(){
                dispatch({type: actionTypes.UI.UI_GETNEWCLAC})
                //dispatch({type:actionTypes.HTTP.POST})
                // subscribe(actionTypes.UI.UI_GETINITCALC,(state,_tools)=>{
                //     // eslint-disable-next-line no-empty-pattern
                //     const { } = _tools.Tools
                  
                // })
                // dispatch({type:actionTypes.UI.UI_GETNEWCLAC})

            }
        })
        InitDragable('.m-Template-Page-Area',
            {id:'#print',fn:'makePrint'},
            {id:'#loadprint',fn:'loadPrint'},
            {id:'#newPrint',fn:'newPrint'}
        )
    })
})()
