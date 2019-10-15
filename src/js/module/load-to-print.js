
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
    const newTables =payload.Tables
    for (let i = 0; i < newTables.length; i++) {
        const table = newTables[i]
        const $tableClone =element.getElementById('#table-'+table.key).cloneNode(true)
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



  
}