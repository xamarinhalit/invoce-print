/* eslint-disable no-undef */

const GetFormat = (item,format)=>{
    if(format!='' && format!=undefined && format !=null){
        switch (format) {
        default:
            break
        }
    }
    return item.ItemValue
}
const LoadToPrint = (payload,element)=>{
    const $root = element.cloneNode(true)
    const newTables =payload.Tables
    for (let i = 0; i < newTables.length; i++) {
        const table = newTables[i]
        const $tableClone =$root.getElementById('#table-'+table.key).cloneNode(true)
        for (let j = 0; j < table.children.length; j++) {
            const tablechild = table.children[j]
            let $row= $tableClone.querySelector('div[data--row-index=\''+tablechild.RowIndex+'\']')
            if($row==null){
                $row=$tableClone.querySelector('div[data--row-index="0"]').cloneNode(true)
                $tableClone.appendChild($row)
            }
            const $column=$($($row).find('.'+tablechild.value.ItemKey))
            $column.html(GetFormat(tablechild.value,tablechild.value.Format))
        }
    }
    const newClons =payload.Clons
    for (let i = 0; i < newClons.length; i++) {
        const clons = newClons[i]
        const $clons=$($root).find('.'+clons.value.ItemKey)
        $clons.html(GetFormat(clons.value,clons.value.Format))
    }
    return $root
}
const PrintToLoad = ({Print},{Tables,Clons},$root)=>{
    let hstyle= '<style>'
    hstyle+='@page {'
    hstyle+='size: '+Print.PageSize+ ' '
    hstyle+=Print.PageType=='Dikey'?'landscape':'portrait' +';'
    hstyle+='padding:0;margin:0cm;}</style>'
    const clnode =LoadToPrint({Tables,Clons},$root[0])
    clnode.removeAttribute('id')
    let _div = null
    if(Print.PageCopy>1){
        _div=document.createElement('div')
        _div.style.display='flex'
        if(Print.CopyDirection=='Yanyana'){
            _div.style.flexDirection='row'
        }else{
            _div.style.flexDirection='column'
        }
        for (let i = 0; i < parseInt(Print.PageCopy); i++) {
            const cl2 =clnode.cloneNode(true)
            cl2.style.position='absolute'
            if(Print.CopyDirection=='Yanyana'){
                let cw = $(cl2).width()
                cl2.style.width=cw + 'px'
                cl2.style.left=cw*i +'px'
            }else{
                let cw = $(cl2).height()
                cl2.style.height=cw + 'px'
                cl2.style.top=cw*i +'px'
            }
            _div.appendChild(cl2)
        }
          
        // var myWindow = window.open("", "MsgWindow")
        // myWindow.document.write(_div.innerHTML)
        $(_div).printThis({
            debug: false, // show the iframe for debugging
            importCSS: true, // import parent page css
            importStyle: true, // import style tags
            printContainer: true, // print outer container/$.selector
            pageTitle: '', // add title to print page
            removeInline: false, // remove inline styles from print elements
            removeInlineSelector: '*', // custom selectors to filter inline styles. removeInline must be true
            printDelay: 0, // variable print delay
            header:hstyle, // prefix to html
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
    }else{
        $(clnode).printThis({
            debug: false, // show the iframe for debugging
            importCSS: true, // import parent page css
            importStyle: true, // import style tags
            printContainer: true, // print outer container/$.selector
            pageTitle: '', // add title to print page
            removeInline: false, // remove inline styles from print elements
            removeInlineSelector: '*', // custom selectors to filter inline styles. removeInline must be true
            printDelay: 0, // variable print delay
            header:hstyle, // prefix to html
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
    }
      

}