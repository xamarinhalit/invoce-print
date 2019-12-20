/* eslint-disable no-useless-escape */
/* eslint-disable no-fallthrough */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

var page = $('#PrintPage')
var JsonData = '', JsonSettings = '', JsonTableData = '', PageWidth = 0, PageHeight = 0, PageCopy = 1, pageOrientation = '', TableRowCount = 0
var PdfContent = {}
var price = ''
var currencyId = ''
var currencySymbol = ''
require('./pdfmake')
require('./PdfFont')
export function PdfLoad(JsonDataLoad, JsonSettingsLoad, JsonTableDataLoad) {
    PdfClear()
    JsonData = JsonDataLoad
    JsonSettings = JsonSettingsLoad
    JsonTableData = JsonTableDataLoad
    PageCopy = parseFloat(JsonSettings.PageCopy)
    PageWidth = (parseFloat(JsonSettings.PageWidth.replace(',', '.')) * 32).toFixed(4)
    PageHeight = (parseFloat(JsonSettings.PageHeight.replace(',', '.')) * 32).toFixed(4)

    if (JsonSettings.CopyDirection == 'Yanyana') {
        PageWidth = PageWidth * PageCopy
    } else if (JsonSettings.CopyDirection == 'Altalta') {
        PageHeight = PageHeight * PageCopy
    }
    pageOrientation = PageWidth <= PageHeight ? 'portrait' : 'landspace'

    //var pageCount = Math.ceil(JsonTableDataRowCount() / PageRowCount());
    //console.log(pageCount);

    PdfContent = {
        pageSize: { width: parseFloat(PageWidth), height: parseFloat(PageHeight) },
        pageOrientation: pageOrientation,
        pageMargins: 0,
        content: []
	
    }
    Print.PrintSettings.set(PageWidth, PageHeight)
    var left = 0, top = 0
    Print.PageData({ left, top })
    for (var i = 1; i < PageCopy; i++) {
        if (JsonSettings.CopyDirection == 'Yanyana') {
            left = left + parseFloat(PageWidth / PageCopy)
        } else if (JsonSettings.CopyDirection == 'Altalta') {
            top = top + parseFloat(PageHeight / PageCopy)
        }

        Print.PageData({ left, top })
    }
    Print.Print()
}


var Print = {
    Print: function () {

        //var pdf = pdfMake.createPdf(PdfContent);

        console.log(PdfContent)
        //console.log(PdfContent.content[12]["table"]["body"][0]);

        var pdf = ''

        //$.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());

        //if ($.browser.chrome) {
        //	 pdf = pdfMake.createPdf(PdfContent);
        //}
        //if ($.broswer.firefox) {
        //	pdf = pdfMake.createPdf(PdfContent);
        //}
        //else { pdf = pdfMake.createPdf(PdfContent).download(); }
        pdf = pdfMake.createPdf(PdfContent)

        pdf.getDataUrl(function (url) {
            pdf.print()
            window.close()
        })
    },
    PrintSettings: {
        set: function (width, height) {
            $('#PrintPage').css({ width: width, height: height })
        }
    },
    PageData: function (position) {
        jQuery.map(JsonData, function (item) {
            if (item.ItemKey === 'GrandTotal')
                price = item.ItemValue.replace(',', '.')
            return item
        })
        $.each(JsonData, function (index, item) {
            switch (item.ItemType) {
            case 'Field': Print.setItem.setField(item, position); break
            case 'Table': Print.setItem.setTable(item, position); break
            case 'TableField': Print.setItem.setTableItem(item, position); break
            case 'CustomText': Print.setItem.setField(item, position); break
            case 'CustomImage': Print.setItem.setImage(item, position); break
            default: break
            }
        })

    },
    setItem: {

        set: function (element, item, position) {

            var div = $('<div></div>')
            $(div).attr('style', item.Style)
            var left = parseFloat($(div).css('left')) + position.left
            var top = parseFloat($(div).css('top')) + position.top
            var width = parseFloat($(div).css('width'))
            var height = parseFloat($(div).css('height'))
            var fontSize = parseFloat($(div).css('font-size'))
            var fontFamily = $(div).css('font-family')
            var fontWeight = $(div).css('font-weight')
            var fontStyle = $(div).css('font-style')
            var rotate = parseFloat($(div).css('transform').replace('rotate(', '').replace('deg)', ''))
            rotate = isNaN(rotate) ? 0 : rotate
            var alignment = $(div).css('text-align')
            fontSize = (parseFloat(fontSize) * 1.33).toFixed(0)
            if (item.ItemType == 'CustomImage') {
                PdfContent.content.push({
                    image: item.ItemTitle,
                    width: width,
                    height: height,
                    absolutePosition: { x: left, y: top }
                })
            }
            if (item.ItemType == 'Table') {
                var TableRows = { row: [], subrow: [] }
                $.each(JsonData, function (i, t) {
                    if (t.SubItemKey == item.ItemKey & t.ItemType == 'TableField' & t.Status) {
                        if (t.TableType == 'Column' & t.Status) {
                            TableRows.row.push(t)
                        } else {
                            TableRows.subrow.push(t)
                        }
                    }

                })
                TableRows.row = jQuery.grep(TableRows.row, function (a) {
                    return a.Status == true
                })

                //TableRows.row = TableRows.row.filter(function (item) {
                //    return (item.Status);
                //});
                //if (item.ItemValue.indexOf(",") != -1) {
                //    itemVal = parseFloat(item.ItemValue).toFixed(2);
                //} else { itemVal = item.ItemValue; }


                //buradaki for, şablon ayarlarında seçilen ürün adedi kadar örnek ürün ekliyor.
                for (var i = 0; i < JsonSettings.PageProduct; i++) {
                    console.log(fontWeight)
                    if (JsonSettings.PageProduct > 1 && i != 0) {
                        top = top + 25
                    }
                    PdfContent.content.push({
                        absolutePosition: { x: left, y: top },
                        style: {
                            fontSize: fontSize,
                            bold: fontWeight == 'bold',
                            italics: fontStyle == 'italic',
                            //alignment: alignment,
                            //fillColor: '#000',
                            font: fontFamily,
                            width: width,
                            height: height
                        },
                        table: {
                            headerRows: 0,
                            heights: ['auto'],
                            widths: buildTableWidth(TableRows),
                            body: buildTableBody(TableRows, item)
                        },
                        layout: 'noBorders'
                    })
                }
            } else {
                PdfContent.content.push({
                    columns: [
                        {
                            bold: fontWeight == 'bold' ? true : false,
                            text: item.ItemValue,
                            italics: fontStyle == 'italic',
                            width: width,
                            fontSize: fontSize,
                            height: height,
                        }
                    ],
                    absolutePosition: { x: left, y: top }
                })
				
			



            }

        },
        setField: function (item, position) {
            var element = $('<div>' + item.ItemTitle + '</div>')
            if (item.ItemKey == 'CurrencyId') {
                switch (item.ItemValue) {
                case '1': item.ItemValue = '₺'; currencyId = '1'; currencySymbol = '₺'; break
                case '2': item.ItemValue = '$'; currencyId = '2'; currencySymbol = '$'; break
                case '3': item.ItemValue = '€'; currencyId = '3'; currencySymbol = '€'; break
                case '4': item.ItemValue = '£'; currencyId = '4'; currencySymbol = '£'; break
                default: break
                }
                return false
            }
            if (item.ItemKey == 'TotalWithText') {
                item.ItemValue = toWords(price, currencyId)
            }
            if (item.Format == '0,00') {
                item.ItemValue = parseFloat(item.ItemValue).toFixed(2) + ' ' + currencySymbol
            }

            Print.setItem.set(element, item, position)

        },
        setImage: function (item, position) {
            var element = $('<div><img src=\'' + item.ItemTitle + '\' width=\'100%\' height=\'100%\' /></div>')
            Print.setItem.set(element, item, position)
        },
        setTable: function (item, position) {
            var element = $('<div><table style=\'width:100%;' + item.Style + '\'> <tbody> <tr class=\'rows\'></tr> </tbody> </table></div>')
            Print.setItem.set(element, item, position)
        },
        setTableItem: function (item, position) {
            if (item.Status) {
                var Table = $('> div[data-key="' + item.SubItemKey + '"] table tbody', page)
                var row = $('tr.rows', Table)

                if (item.TableType == 'Row') {
                    $('<tr class=\'subrow\'><td style=\'' + item.Style + '\'>' + item.ItemValue + ' </td></tr>').appendTo(Table)
                } else if (item.TableType == 'Column') {
                    row.append('<td width=\'' + item.Width + '\' style=\'' + item.Style + '\'> ' + item.ItemValue + ' </td>').appendTo(Table)
                }
            }

        },
    }
}

function buildTableWidth(TableRows) {
    var w = []


    $.each(TableRows.row, function (index, item) {
        w.push(parseFloat(item.Width))
    })
    //life saver
    w.reverse()


    return w
}


function buildTableBody(TableRows, item) {
    var body = [], columnCount = TableRows.row.length
    if (JsonTableData != undefined) {
        $.each(TableJsonDataGroup(item), function (ind, item) {
            var dataRow = []
            $.each(item, function (index, row) {
                var itemValue = ''
                row.ItemValue = row.ItemValue + ''
                if (row.Format == '0,00') {
                    itemValue = row.ItemValue + ' ' + currencySymbol
                } else { itemValue = row.ItemValue }
                //if (row.Format.search(",") != -1) {
                //	itemValue = row.ItemValue + " " + currencySymbol;
                //} else { itemValue = row.ItemValue };

                var element = $('<div></div>').attr('style', row.Style).html(itemValue)
                var fontWeight = $(element).css('font-weight')
                var fontStyle = $(element).css('font-style')
                if (row.TableType == 'Column' & row.Status) {
                    dataRow.push({
                        colspan: 1,
                        text: element.text(),
                        //width: row.Width,
                        alignment: $(element).css('text-align'),
                    })
                }
            })

            body.push(dataRow)


            var subRow = []
            $.each(item, function (index, row) {

                if (row.TableType == 'Row' & row.ItemValue != '') {
                    var element = $('<div></div>').attr('style', row.Style)

                    subRow.push({
                        text: row.ItemValue, colSpan: columnCount,
                        width: row.Width, alignment: $(element).css('text-align')
                    })
                    for (var i = 1; i < columnCount; i++) {
                        subRow.push({})
                    }
                }
            })
            if (subRow.length > 0) {
                body.push(subRow)
            }

        })
    } else {
        for (var i = 0; i < item.RowLength; i++) {
            var dataRow = []
            $.each(TableRows.row, function (index, row) {
                var element = $('<div></div>').attr('style', row.Style).html(row.ItemValue)

                dataRow.push({
                    colspan: 1,
                    text: element.text(),
                    width: row.Width,
                    alignment: $(element).css('text-align')
                })
            })
            body.push(dataRow)

            $.each(TableRows.subrow, function (index, row) {
                var element = $('<div></div>').attr('style', row.Style)
                var subRow = []
                subRow.push({
                    text: row.ItemValue, colSpan: columnCount,
                    width: row.Width, alignment: $(element).css('text-align')
                })
                for (var i = 1; i < columnCount; i++) {
                    subRow.push({})
                }
                body.push(subRow)
            })
        }
    }
    //var dupBody = []
    //for (var i = 0; i < JsonSettings.PageProduct; i++) {
    //	dupBody.push(body[0]);
    //}
    //body = dupBody;
    return body
}
function TableJsonDataGroup(item) {
    var dataRow = []
    JsonTableData.sort(function (a, b) { return (a.Sort - b.Sort) })
    var result = []
    JsonTableData.reduce(function (res, value) {
        if (!res[value.RowGroup]) {
            res[value.RowGroup] = {
                RowGroup: value.RowGroup
            }
            result.push(res[value.RowGroup])
        }
        return res
    }, {})
    for (var i = 0; i < result.length; i++) {
        let row = []
        JsonTableData.filter(function (filter_item) {
            if (filter_item.RowGroup == i & filter_item.TableKey == item.TableKey) {
                row.push(filter_item)
            }
        })
        dataRow.push(row)
    }
    return dataRow
}
function JsonTableDataRowCount() {
    JsonTableData.sort(function (a, b) { return (a.Sort - b.Sort) })
    var result = []
    JsonTableData.reduce(function (res, value) {
        if (!res[value.RowGroup]) {
            res[value.RowGroup] = {
                RowGroup: value.RowGroup
            }
            result.push(res[value.RowGroup])
        }
        return res
    }, {})

    return result.length
}
function PageRowCount() {
    var count = 0
    JsonData.filter(function (filter_item) {
        if (filter_item.ItemType == 'Table') {
            count = filter_item.RowLength
        }
    })
    return count
}
function PdfClear() {
    $('#PrintPage').html('')
    PdfContent = {
        pageSize: { width: parseFloat(PageWidth), height: parseFloat(PageHeight) },
        pageOrientation: pageOrientation,
        pageMargins: 0,
        content: [],
        styles: []
    }

}




var th = ['', 'bin', 'milyon', 'milyar', 'trilyon']
var dg = [' ', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz']
var tn = ['on', 'onbir', 'oniki', 'onüç', 'ondört', 'onbeş', 'onaltı', 'onyedi', 'onsekiz', 'ondokuz']
var tw = ['yirmi', 'otuz', 'kırk', 'elli', 'atmış', 'yetmiş', 'seksen', 'doksan']
var cn = []
function toWords(s, curId) {
    curId = parseFloat(curId)
    switch (curId) {
    case 1:
        cn.push('lira')
        cn.push('kuruş')
    case 2:
        cn.push('dolar')
        cn.push('cent')
        break
    case 3:
        cn.push('euro')
        cn.push('cent')
        break
    case 4:
        cn.push('sterlin')
        cn.push('pence')
        break
    default:
    }
    s = s.toString()
    s = s.replace(/[\, ]/g, '')
    if (s != parseFloat(s)) return 'sayı değil'
    var x = s.indexOf('.')
    if (x == -1) x = s.length
    if (x > 15) return 'çok büyük'
    var n = s.split('')
    var str = ''
    var sk = 0
    for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
            if (n[i] == '1') {
                str += tn[Number(n[i + 1])] + ' '
                i++
                sk = 1
            } else if (n[i] != 0) {
                str += tw[n[i] - 2] + ' '
                sk = 1
            }
        } else if (n[i] != 0) {
            str += dg[n[i]] + ' '
            if ((x - i) % 3 == 0) str += 'yüz '
            sk = 1
        }
        if ((x - i) % 3 == 1) {
            if (sk) str += th[(x - i - 1) / 3] + ' '
            sk = 0
        }
    }
    str += ' ' + cn[0]
    var ksr = 0
    if (x != s.length) {
        var y = s.length
        str += ' '
        // eslint-disable-next-line no-redeclare
        for (var i = x + 1; i < y; i++) {
            if ((y - i) % 3 == 2) {
                if (n[i] == '1') {
                    str += tn[Number(n[i + 1])] + ' '
                    i++
                    sk = 1
                    ksr = 1
                } else if (n[i] != 0) {
                    str += tw[n[i] - 2] + ' '
                    sk = 1
                    ksr = 1
                }
            } else if (n[i] != 0) {
                str += dg[n[i]] + ' '
                if ((y - i) % 3 == 0) str += 'yüz '
                sk = 1
                ksr = 1
            }
            if ((y - i) % 3 == 1) {
                if (sk) str += th[(y - i - 1) / 3] + ' '
                sk = 0
            }
        }
        if (ksr != 0) {
            str += '' + cn[1]
        }
    }
    var spaceChar = str.indexOf(' ')
    var firstChar = str.substring(0, spaceChar)
    if (firstChar == 'bir') str = str.replace('bir ', '')
    return str.replace(/\s+/g, ' ')
}

