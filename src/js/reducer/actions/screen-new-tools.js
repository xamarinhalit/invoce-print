const EmtoPixel=(point)=> {
    let size = getComputedStyle(document.documentElement).fontSize
    if (size != undefined) {
        size = size.replace('px', '')
        size = parseFloat(size)
        if (size < 11) size = 16
    } else {
        size = 16
    }
    return (parseFloat(point) * size).toFixed(0)
}
const PixeltoEm=(pixcel)=> {
    let size = getComputedStyle(document.documentElement).fontSize
    if (size != undefined) {
        size = size.replace('px', '')
        size = parseFloat(size)
        if (size < 11) size = 16
    } else {
        size = 16
    }
    return (pixcel/ size)
}

const pxToVw=($root,pixel)=>{
    return ($root.clientWidth/100)*pixel
}
const pxToVh=($root,pixel)=>{
    return ($root.clientHeight/100)*pixel
}
const getCircularReplacer = () => {
    const seen = new WeakSet()
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return
            }
            seen.add(value)
        }
        return value
    }
}
function copyObject(src) {
    return JSON.parse(JSON.stringify(src, getCircularReplacer()))
}
const GetPrintInit = (state)=> {
    return new Promise((resolve)=>{
     //   const  Items =copyObject(state)
        let Items =state
        // CloneType=> 'Field','Table','TableField,
        const body = document.createElement('div')

        for (let i = 0; i < Items.Clone.Items.Tables.length; i++) {
            const item = Items.Clone.Items.Tables[i]
            const table = document.createElement('table')
            const $table =$(table)
            $table.css( item.value.Style)
            $table.css('position','absolute')
           
            const tbody = document.createElement('tbody')
            const tr =document.createElement('tr')
            for (let j = 0; j < item.children.length; j++) {
                const tritem = item.children[j]
                if(tritem.value!=undefined){
                    const td = document.createElement('td')
                    td.innerHTML=tritem.value.ItemValue
                    tr.appendChild(td)
                }
            }
            tbody.appendChild(tr)
            table.appendChild(tbody)
            body.appendChild(table)
        }



        Items.Clone.Items.Tables =Items.Clone.Items.Tables.map(x=>{
            return {
                Index:x.Index,
                key:x.key,
                children:x.children.map(y=>{
                    return {
                        Index:y.Index,
                        value:y.value,
                        Sort:y.Sort,
                        ToolValue:y.ToolValue,
                        menuindex:y.menuindex
                    }
                }),
                childIndex:x.childIndex,
                ColumIndex:x.ColumIndex,
                RowIndex:x.RowIndex,
                value:x.value,
                Sort:x.Sort
            }
        })
        Items.UI.PANEL.Menu =Items.UI.PANEL.Menu.map(x=>{
            return {
                Index:x.Index,
                ToolValue:x.ToolValue,
                value:x.value,
                Sort:x.Sort
            }
        })
        Items.Clone.Items.Clons =Items.Clone.Items.Clons.map(x=>{
            return {
                Index:x.Index,
                ToolValue:x.ToolValue,
                value:x.value,
                Sort:x.Sort,
                menuindex:x.menuindex
            }
        })
        let _html = document.createElement('html')
        _html.appendChild(body)
        const wi = window.open("")
        wi.document.body.appendChild(body)
        $(body.innerHTML).printThis({
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
        resolve()
    })
}
export default GetPrintInit