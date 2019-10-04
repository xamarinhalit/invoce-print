/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { PdfLoad} from '../../plugins/_TemplatePrint'
let $clone=null,RowLength =null,Key=null,ItemTitle=null,TableKey=null,$jsonTableData = []
$(function () {
	
    $jsonTableData = []
    let $ToolBox=null
	

    //Validation
    // $("#EfarForm").validate({
    // 	ignore: "",
    // 	rules:
    // 	{
    // 		TemplateValue: { required: true }
    // 	},
    // 	errorPlacement: function (error, element) {
    // 		$(element).addClass("efar-jvalidate-error invoice-validate");
    // 	}
    // });

    //Şablon Fonksiyonları
    $.fn.extend({
        Page: function () {
            var Page = $(this)

            Page.pageLoad()
            Page.trigger('click')
            Page.propChange()
            Page.droppable({
                classes: {
                    'ui-droppable-active': 'ui-state-active',
                    'ui-droppable-hover': 'ui-state-hover'
                },
                drop: function (event, ui) {
                    if (!ui.draggable.hasClass('efar-field')) {
                        $(ui.draggable).createItem(Page, ui)
                        Page.trigger('click')
                    } else {
                        ui.draggable.trigger('click')
                    }
                    Page.pageLoad()
                },
            })

            $('#BtnPrintPdf').click(function () {
                $(this).PrintPopup()
            })
            $('#BtnPdfOpen').click(function () {
                $(this).Print()
            })
        },
        pageLoad: function () {
            $(this).selectPage()
            $('.efar-field', this).draggable({
                containment: 'parent', revert: 'invalid',
                drag: function (event, ui) {
                    $(ui.helper).ItemProp()
                }
            })
            $('.efar-field', this).resizable({
                resize: function (event, ui) {
                    ui.helper.trigger('click')
                    $(ui.helper).ItemProp()
                }
            })
            $('.efar-field', this).removeItem()
            $('.efar-field', this).selectItem()


        },
        selectPage: function () {
            $(this).click(function () {
                $(this).addClass('active')
                $('.efar-field', this).removeClass('active')
                $('.efar-field .efar-field-textarea', this).hide()
                $('.Prop-Area').show()
                $('.Prop-Group-Area').hide()
                $('.m-Tool ul li').removeClass('select')
                var fontfamily = $(this).css('font-family')
                var fontsize = $(this).PixeltoPoint($(this).css('font-size'))

                $('#FontSize').val(fontsize)
                $(this).ItemSetFontFamily(fontfamily)
                var title = 'Sayfa Özellikleri'
                $('.Prop-Area .Title').text(title)
                $('.Prop-Area .Title').attr('title', title)

            })
        },
        Tools: function () {
            $ToolBox = $(this)

            $('ul.efar-drag-ul li', $ToolBox).draggable({
                revert: 'invalid',
                helper: 'clone',
                // eslint-disable-next-line no-unused-vars
                // eslint-disable-next-line no-dupe-keys
                helper: function (ev, _ui) {
                    var $elem = $(this)
                    var pos = $elem.offset()
                    var dX = ev.pageX - pos.left
                    var dY = ev.pageY - pos.top
                    $clone = $elem.clone()
                    $(this).draggable('option', 'cursorAt', { left: dX, top: dY })
                    return $clone
                }
            })
            $('ul.sortable', $ToolBox).sortable({
                helper: 'clone', containment: $(this).parent(), stop: function (event, ui) {
                    var Key = $(ui.item).data('subkey')
                    ui.item.refreshColumnTable(Key)
                }
            })
            $ToolBox.selectToolsItem()


            //Menü Başlığına Tıklayınca
            $('h2', $ToolBox).click(function () {
                var $Menu = $(this).parent()
                if ($Menu.hasClass('active')) {
                    $Menu.removeClass('active')
                    $('ul', $Menu).hide()

                    $('h2 i', $Menu).removeClass('fa-chevron-up')
                    $('h2 i', $Menu).addClass('fa-chevron-down')

                } else {
                    $('ul', '.m-Tool').hide()
                    $('.m-Tool').removeClass('active')
                    $('h2 i', $Menu).removeClass('fa-chevron-down')
                    $('h2 i', $Menu).addClass('fa-chevron-up')
                    $Menu.addClass('active')
                    $('ul', $Menu).show()
                }
            })
        },
        selectToolsItem: function () {
            $ToolBox = $(this)
            $('ul.sortable li', $ToolBox).click(function () {
                if ($(this).hasClass('select')) {
                    $(this).removeClass('select')
                    $('.m-Template-Page-Area').trigger('click')
                } else {
                    $('ul.sortable li', $ToolBox).removeClass('select')
                    $(this).addClass('select')

                    $('.m-Template-Prop .Prop-Area').hide()
                    $('.m-Template-Prop .Prop-Area-Title').show()
                    $('.Prop-Area-Title, .Prop-Area-Align').show()
                    $('.Prop-Group-Buttons.GroupMulti button').removeClass('active')

                    var title = $(this).text()
                    var Table = $('.efar-field[data-key="' + $(this).data('subkey') + '"]')
                    $('.Prop-Area .Title').text(title)
                    $('.Prop-Area .Title').attr('title', title)

                    var div = $('<div></div>')
                    div.attr('style', $(this).attr('data-style'))
                    // eslint-disable-next-line no-unused-vars
                    var fontSize = div.css('font-size')
                    var textAlign = div.css('text-align')
                    var fontStyle = div.css('font-style')
                    var fontWeight = div.css('font-weight')

                    //fontSize = fontSize == "" ? $ToolBox.PixeltoPoint(Table.css("font-size")) : parseFloat(fontSize);
                    //$('#FontSize').val(fontSize);

                    textAlign == 'left' ? $('#AlignLeft').addClass('active') : (textAlign == 'center' ? $('#AlignCenter').addClass('active') : (textAlign == 'right' ? $('#AlignRight').addClass('active') : ''))
                    //fontStyle == "italic" ? $('#Italic').addClass("active") : $('#Italic').removeClass("active");
                    //fontWeight == "bold" ? $('#Bold').addClass("active") : $('#Bold').removeClass("active");
                }
            })
            $('ul.sortable li span', $ToolBox).unbind('click').click(function () {
                var Item = $(this).parent()
                var Key = Item.data('subkey')
                if (Item.hasClass('active')) {
                    Item.removeClass('active')
                } else {
                    Item.addClass('active')
                }
                Item.refreshColumnTable(Key)
            }).on('click', $(this).parent(), function (e) {
                e.stopPropagation()
            })
        },

        createItem: function (page, ui) {
            // let width,height,Type,Value,Format,Title,Key;
            let {key:Key,width,height,type:Type,value:Value,format:Format,tablekey:TableKey} = this.dataset
            // Key = $(this).data("key");
            // TableKey = $(this).data("tablekey");
            const {left:uleft,top:utop } = ui.offset
            const {left:mleft,top:mtop } = $('.m-Template-Page-Area').offset()
            let left = (uleft-mleft)
            let top = (utop-mtop)
            // width = $(this).data("width");
            // height = $(this).data("height");
            // Type = $(this).data("type");
            // Value = $(this).data("value");
            // Format = $(this).data("format");
            Title = $(this).text().trim()
            var item = '<div>' + Value + '</div>'
            if (Type == 'CustomText') {
                item = '<div> <textarea class=\'efar-field-textarea\'>' + Value + '</textarea> <span> ' + Value + '</span> <i class=\'fa fa-edit Edit\'></i> </div>'
                Key = Key + $.now()
            } else if (Type == 'CustomImage') {
                Key = Key + $.now()
                item = '<div> <img src=\'\' alt=\'\' class=\'efar-field-image\' />  <i class=\'fa fa-upload Upload field-label\'></i>   <input type=\'file\'  class=\'field-file\' id=\'file-' + Key + '\' /> </div>'
            }


            $(item).addClass('efar-field').attr('data-key', Key).attr('data-tablekey', TableKey).attr('data-type', Type).attr('data-title', Title).attr('data-format', Format).css({ 'left': left, 'top': top, 'width': width, 'height': height, 'font-size': '10pt', 'font-family': 'roboto' }).append('<i class=\'fa fa-times Remove\'></i>').appendTo(page)
            if (Type == 'Table') {

                //draggable drop first
                $('.m-Tool ul li[data-subkey="' + Key + '"]').css('display', 'block')
                var Table = $('.efar-field[data-key="' + Key + '"]', page)

                Table.createTable(Key)
            }

            if (Type != 'Table') {
                //sürükle bıraktan sonra item kaybolmaması
                $(ui.draggable).css('background-color', 'rgba(3, 169, 244, 0.24);')
            }
            else if (Type != 'CustomText' & Type != 'CustomImage') {
                $(ui.draggable).hide()
            }

            //if (Type != "CustomText" & Type != "CustomImage") {
            //	$(ui.draggable).hide();
            //}

            $('.efar-field[data-key="' + Key + '"]', page).editItem()
            $('.efar-field[data-key="' + Key + '"]', page).uploadItem()


        },
        removeItem: function () {
            $('i.Remove', this).click(function () {
                var itemCount = 0
                var Key = $(this).parent().data('key')
                var Type = $(this).parent().data('type')

                $('.m-Tool ul li[data-key=' + Key + ']').show()
                if (Type == 'Table') {
                    $('.m-Tool ul li[data-subkey="' + Key + '"]').hide()
                }

                //tıklanan elementi siliyoruz
                $(this).parent().remove()


                //eğer tablo değilse
                if (Type != 'Table') {

                    //sayfadaki silinen elementten başka var mı kontrol ediyoruz
                    var Page = $('.m-Template-Page-Area')
                    $('.efar-field', Page).each(function () {
                        if ($(this).data('key') == Key) {
                            itemCount++
                            //alert($(this).data("key"));
                        }
                    })

                    //eğer sayfada silinen elementten kalmamışsa, tool style eski hâline gelir.
                    if (itemCount == 0) {
                        $('.m-Tool ul li[data-key="' + Key + '"]').css('background-color', '#fff')
                    }
                }




            })
        },
        editItem: function () {
            $('i.Edit', this).on('click', function (e) {
                let textarea,value
                textarea = $('.efar-field-textarea', $(this).parent())
                value = $('span', $(this).parent())
                textarea.toggle()

                textarea.on('keyup keypress focusout', function () {
                    value.text($(this).val())
                })
            })
        },
        uploadItem: function () {
            let file, Key = $(this).data('key')
            file = $('.field-file', this)
            file.on('change', function () {
                file.fieldUploadImage(this)
            })
            file.trigger('click')
            $('i.Upload', this).on('click', function (e) {
                file = $('.field-file', $(this).parent())
                file.trigger('click')
            })
        },
        fieldUploadImage: function (input) {
            var field = $(input).parent()
            if (input.files && input.files[0]) {
                var reader = new FileReader()
                reader.onload = function (e) {
                    $('.efar-field-image', field).attr('src', e.target.result)
                }
                reader.readAsDataURL(input.files[0])
            }
        },
        selectItem: function () {
            $(this).attr('tabindex', '0')

            $(this).on('click', function () {
                $('.efar-field').removeClass('active')
                $(this).addClass('active')
                $(this).parent().removeClass('active')
                $(this).ItemProp()


                //Klavyeden Delete tuşuna basılınca Seçili Alanı siliyoruz.
                $(this).keyup(function (event) {
                    if (event.keyCode === 46) {
                        $('i.Remove', this).trigger('click')
                    }
                })



            }).on('click', $(this).parent(), function (e) {
                e.stopPropagation()
            })


        },
        ItemProp: function () {

            var Field = $(this)
            var Type = Field.data('type')
            $('.m-Template-Prop').propRefresh()
            if (Type == 'Table') {
                $('.Prop-Area-Align').hide()
                $('.Popup-Area-RowLength').show()
            }

            var title = $(this).data('title')
            var fontfamily = $(this).css('font-family')
            var fontsize = $(this).PixeltoPoint($(this).css('font-size'))
            var field_left = $(this).PixeltoCm($(this).css('left'))
            var field_top = $(this).PixeltoCm($(this).css('top'))
            var field_width = $(this).PixeltoCm($(this).css('width'))
            var field_height = $(this).PixeltoCm($(this).css('height'))
            var fontWeight = $(this).css('font-weight')
            var fontStyle = $(this).css('font-style')
            var textAlign = $(this).css('text-align')
            var rotate = $(this).getRotationDegrees()
            var rowlength = $(this).attr('data-rowlength')

            $('.Prop-Area .Title').text(title)
            $('.Prop-Area .Title').attr('title', title)
            $(this).ItemSetFontFamily(fontfamily)
            $('#FontSize').val(fontsize)
            $('#Left').val(field_left.replace('.', ','))
            $('#Top').val(field_top.replace('.', ','))
            $('#Width').val(field_width.replace('.', ','))
            $('#Height').val(field_height.replace('.', ','))
            $('#Rotate').val(rotate)
            $('#RowLength').val(rowlength == undefined ? '1' : rowlength)
            fontWeight == 'bold' ? $('#Bold').addClass('active') : $('#Bold').removeClass('active')
            fontStyle == 'italic' ? $('#Italic').addClass('active') : $('#Italic').removeClass('active')

            $('.Prop-Group-Buttons.GroupMulti button').removeClass('active')
            textAlign == 'left' ? $('#AlignLeft').addClass('active') : (textAlign == 'center' ? $('#AlignCenter').addClass('active') : (textAlign == 'right' ? $('#AlignRight').addClass('active') : ''))


        },
        getRotationDegrees: function () {
            var obj = $(this)
            var matrix = obj.css('-webkit-transform') ||
				obj.css('-moz-transform') ||
				obj.css('-ms-transform') ||
				obj.css('-o-transform') ||
				obj.css('transform')
            var angle
            if (matrix !== 'none') {
                var values = matrix.split('(')[1].split(')')[0].split(',')
                var a = values[0]
                var b = values[1]
                angle= Math.round(Math.atan2(b, a) * (180 / Math.PI))
            } else { angle = 0 }
            return (angle < 0) ? angle + 360 : angle
        },

        propRefresh: function () {
            $('.m-Template-Prop .Prop-Area').show()
            $('.m-Template-Prop .Prop-Area.Popup-Area-RowLength').hide()
            $('.m-Template-Prop .Prop-Area.Popup-Area-Rotate').hide()
            $('.m-Tool ul li').removeClass('select')
        },
        propChange: function () {
            var Page = $(this)

            //Input Değerler (Yazı Boyutu, Soldan, Yukarıdan, Genişlik, Yükseklik)
            $('.Prop-Area input').on('keyup keypress focusout', function () {
                let Key,Type,Input,Value
                var selected = $('.m-Template-Page .active')
                Key = selected.data('key')
                Type = selected.data('type')
                Input = $(this).attr('id')
                Value = $(this).val()
                if ($('.m-Tool ul li.select').length == 0) {
                    if (Key == undefined) {
                        //Sayfa seçili
                        if (Input == 'FontSize') {
                            Page.css('font-size', Value + 'pt')
                            $('.efar-field', Page).css('font-size', Value + 'pt')
                        }
                    } else {

                        //Sayfa içerisindeki bir Alan seçili
                        var Field = $('.efar-field[data-key="' + Key + '"]', Page)
                        if (Input == 'FontSize') {
                            Field.css('font-size', Value + 'pt')
                        } else if (Input == 'Left') {
                            Field.css('left', Field.CmtoPixel(Value.replace(',', '.')) + 'px')
                        } else if (Input == 'Top') {
                            Field.css('top', Field.CmtoPixel(Value.replace(',', '.')) + 'px')
                        } else if (Input == 'Width') {
                            Field.css('width', Field.CmtoPixel(Value.replace(',', '.')) + 'px')
                        } else if (Input == 'Height') {
                            Field.css('height', Field.CmtoPixel(Value.replace(',', '.')) + 'px')
                        } else if (Input == 'Rotate') {
                            Field.css('transform', 'rotate(' + Value + 'deg)')
                        } else if (Input == 'RowLength') {
                            Field.attr('data-rowlength', Value)
                            Field.RowLengthTable(Field, Value)
                        }
                    }

                } else {
                    //Tablodaki bir kolon seçili
                    selected = $('.m-Tool ul li.select')
                    Key = selected.data('key')
                    let Table = $('.efar-field[data-key="' + selected.data('subkey') + '"]')
                    let FieldHeader = $('table.table .table-alignHeaders th[data-key="' + Key + '"]', Table)
                    Field = $('table.table td[data-key="' + Key + '"]', Table)
                    if (Input == 'Width') {
                        var w = Field.CmtoPixel(Value.replace(',', '.'))
                        selected.attr('data-width', w)
                        FieldHeader.css('width', w + 'px')
                    } else if (Input == 'FontSize') {
                        //console.log(Value);
                        //FieldHeader.css('font-size', Value + "pt");
                        //Field.css('font-size', Value + "pt");
                        //selected.attr('data-style', Field.attr('style'));
                    }
                    Table.resizeTable()
                }
            })

            //Yazı Fontu
            $('.FontFamily span').click(function () {
                $('.FontFamily ul').slideToggle()
            })
            $('.FontFamily li').click(function () {
                var selected = $('.m-Template-Page .active')
                let Key = selected.data('key')
                let fontFamily = $(this).css('font-family')

                $('.FontFamily span').text($(this).text())
                $('.FontFamily span').css('font-family', fontFamily)
                $('.FontFamily ul').hide()
                if (Key == undefined) {
                    Page.css('font-family', fontFamily)
                    $('.efar-field', Page).css('font-family', fontFamily)
                } else {
                    var Field = $('.efar-field[data-key="' + Key + '"]', Page)
                    Field.css('font-family', fontFamily)
                }

            })

            //Bold ve Italik
            $('.Prop-Group-Buttons.GroupSingle button').click(function () {
                var hasClass = $(this).hasClass('active')
                if (hasClass) {
                    $(this).removeClass('active')
                } else {
                    $(this).addClass('active')
                }

                var Value = $(this).attr('id')
                var selected = $('.m-Template-Page .active')
                let Key = selected.data('key')
                if ($('.m-Tool ul li.select').length == 0) {
                    if (Key != undefined) {
                        var Field = $('.efar-field[data-key="' + Key + '"]', Page)
                        if (Value == 'Bold') {
                            Field.css('font-weight', hasClass ? 'normal' : 'bold')
                        } else if (Value == 'Italic') {
                            Field.css('font-style', hasClass ? 'normal' : 'italic')
                        }
                    }
                } else {
                    //Tablodaki bir kolon seçili
                    selected = $('.m-Tool ul li.select')
                    Key = selected.data('key')
                    let Table = $('.efar-field[data-key="' + selected.data('subkey') + '"]')
                    let FieldHeader = $('table.table .table-alignHeaders th[data-key="' + Key + '"]', Table)
                    Field = $('table.table td[data-key="' + Key + '"]', Table)
                    if (Value == 'Bold') {
                        FieldHeader.css('font-weight', hasClass ? 'normal' : 'bold')
                        Field.css('font-weight', hasClass ? 'normal' : 'bold')
                    } else if (Value == 'Italic') {
                        FieldHeader.css('font-style', hasClass ? 'normal' : 'italic')
                        Field.css('font-style', hasClass ? 'normal' : 'italic')
                    }
                    selected.attr('data-style', Field.attr('style'))
                }

            })

            //Yazı Hizalama
            $('.Prop-Group-Buttons.GroupMulti button').click(function () {
                var hasClass = $(this).hasClass('active')
                if (!hasClass) {
                    $('.Prop-Group-Buttons.GroupMulti button').removeClass('active')
                    $(this).addClass('active')
                    var Value = $(this).attr('id')
                    var selected = $('.m-Template-Page .active')
                    let Key = selected.data('key')
                    if ($('.m-Tool ul li.select').length == 0) {
                        if (Key != undefined) {
                            var Field = $('.efar-field[data-key="' + Key + '"]', Page)
                            Field.css('text-align', Value == 'AlignLeft' ? 'left' : (Value == 'AlignCenter' ? 'center' : 'right'))
                        }
                    } else {
                        //Tablodaki bir kolon seçili
                        selected = $('.m-Tool ul li.select')
                        Key = selected.data('key')
                        let Table = $('.efar-field[data-key="' + selected.data('subkey') + '"]')
                        let FieldHeader = $('table.table .table-alignHeaders th[data-key="' + Key + '"]', Table)
                        Field = $('table.table td[data-key="' + Key + '"]', Table)

                        FieldHeader.css('text-align', Value == 'AlignLeft' ? 'left' : (Value == 'AlignCenter' ? 'center' : 'right'))
                        Field.css('text-align', Value == 'AlignLeft' ? 'left' : (Value == 'AlignCenter' ? 'center' : 'right'))

                        selected.attr('data-style', Field.attr('style'))
                    }
                }
            })
        },
        ItemSetFontFamily: function (fontFamily) {
            $('.FontFamily ul li').each(function () {
                if ($(this).css('font-family') == fontFamily) {
                    $('.FontFamily span').text($(this).text())
                    $('.FontFamily span').css('font-family', fontFamily)
                }
            })
        },

        PixeltoPoint: function (Pixel) {
            return (parseFloat(Pixel) / 1.33).toFixed(0)
        },
        PixeltoCm: function (Pixel) {
            return (parseFloat(Pixel) / 32).toFixed(2)
        },
        CmtoPixel: function (Cm) {
            return (parseFloat(Cm) * 32).toFixed(4)
        },

        createTable: function (Key) {
            //adding new row
            var Table = $(this)
            $('table.table thead tr', Table).html('')
            $('table.table tbody tr.rows', Table).remove()
            $('table.table tbody tr.subrow', Table).remove()
            $('table.table tbody', Table).append('<tr class=\'rows\'></tr>')



            $('.m-Tool ul.sortable li[data-subkey="' + Key + '"].active').each(function (i, t) {
                var ColumnCount = $('.m-Tool ul.sortable li[data-subkey="' + Key + '"].active[data-tabletype="Column"]').length
                var FieldWidth = $(t).data('width')
                var FieldTableType = $(t).data('tabletype')
                var FieldStyle = $(t).attr('data-style')
                if (FieldTableType == 'Column') {
                    $('table.table thead tr.table-alignHeaders').append(' <th data-key=\'' + $(t).data('key') + '\' style=\'width:' + FieldWidth + 'px; ' + FieldStyle + '\'></th>')

                    $('table.table thead tr:not(.table-alignHeaders)', Table).append(' <th> ' + $(t).text() + ' </th>')
                    $('table.table tbody tr.rows', Table).append(' <td data-format=\'' + $(t).data('format') + '\' data-key=\'' + $(t).data('key') + '\' ' + FieldStyle + '>' + $(t).data('value') + ' </td>')
                } else if (FieldTableType == 'Row') {
                    $('table.table tbody', Table).append('<tr class=\'subrow\'> <td colspan=\'' + ColumnCount + '\' data-key=\'' + $(t).data('key') + '\' style=\'' + FieldStyle + '\'>' + $(t).data('value') + ' </td><tr>')
                }

            })
            $('table.table tbody tr:not(.rows, .subrow)', Table).remove()
            $('table.table', Table).resizeTable()
            RowLength = parseFloat(Table.data('rowlength'))
            Table.RowLengthTable(Table, RowLength)

            //stok hareketi ise clone işlemini yapıyoruz
            if (Key == 'InvoiceMovements') {
                //settings içerisindeki ürün adedini alıyoruz
                if($('#JsonSettings').val()!=undefined){

				
                    var JsonSettings = JSON.parse($('#JsonSettings').val())
					
                    var pageProduct = parseFloat(JsonSettings.PageProduct)

                    //ürün adedi kadar ürünü alt alta yazdırıyoruz
                    for (var i = 1; i < pageProduct; i++) {
                        var $tableBody = $('.efar-table-stocks').find('tbody'),
                            $trLast = $tableBody.find('tr:last'),
                            $trNew = $trLast.clone()
                        $trLast.after($trNew)
                    }
                }
            }
		

        },
        resizeTable: function () {
            var Table = $(this)
            Table.colResizable({ disable: true })
            Table.colResizable({
                disable: false,
                liveDrag: true,
                draggingClass: 'dragging',
                resizeMode: 'flex',
                onResize: function (e) {
                    var Table = $(e.currentTarget)
                    $('.table-alignHeaders th', Table).each(function () {
                        var Key = $(this).data('key')
                        var Width = parseFloat($(this).css('width'))
                        $('.m-Tool ul.sortable li[data-key="' + Key + '"]').attr('data-width', Width)
                    })
                }
            })
        },
        addRowTable: function () {
            var Table = $(this)
            Table.colResizable({ disable: true })
            var html = $('tbody tr.rows:first', Table).html()
            Table.append('<tr class=\'rows removable\'>' + html + '</tr>')

            $.each($('tbody tr.subrow', Table), function () {
                var subRow = $(this).html()
                if (subRow != undefined) {
                    Table.append('<tr class=\'subrows removable\'>' + subRow + '</tr>')
                }
            })

            Table.resizeTable()
        },
        RowLengthTable: function (Table, RowLength) {
            $('table.table tr.removable', Table).remove()
            for (var i = 1; i < RowLength; i++) {
                $('table.table', Table).addRowTable()
            }
        },
        refreshColumnTable: function (Key) {
            var Page = $('.m-Template-Page-Area')
            var Table = $('.efar-field[data-key="' + Key + '"]', Page)
            console.log(Key)
            Table.createTable(Key)
        },

        Settings: function () {
            var JsonSettings = $('#JsonSettings')
            if (JsonSettings.val() == '') {
                $('#PopupSettings').modal({ backdrop: 'static', keyboard: false })
            }
            $('#BtnSettings').click(function () {
                $('#PopupSettings').setSettings()
                $('#PopupSettings').modal({ backdrop: 'static', keyboard: false })
            })

            $('#PopupSettings').on('hidden.bs.modal', function () {
                if (JsonSettings.val() == '') {
                    window.location.href = '/settings/Template'
                }
            })
            $(this).PaperSettings()

            var imgApproval = false

            //template image size control
            $('#image-upload').change(function () {
                var file = this.files[0]

                var reader = new FileReader()

                fileSize = Math.round(file.size / 1024)
                if (fileSize < 1100) {
                    imgApproval = true

                } else {
                    alert('Şablon görseli 1mb\'dan küçük olmalı.')
                }
                console.log(imgApproval)

            })
            $.uploadPreview({
                input_field: '#image-upload',
                label_field: '#image-label',
                imageSave: function (image) {
                    if (imgApproval) {
                        $.ajax({
                            type: 'post',
                            url: '/settings/templateImageUpload',
                            data: { image: image },
                            success: function (data) {
                                $('.m-Template-Page-Background img').attr('src', data)
                                $('.btn-efar-upload').hide()
                                $('.btn-efar-upload.remove').show()
                            }
                        })
                    }
                    else {
                        $('.m-Template-Page-Background img').attr('src', '')
                        $('.btn-efar-upload').show()
                        $('.btn-efar-upload.remove').hide()
                        $('.efar-image-preview').css('background-image', 'none')
                        $('#image-upload').val('')
                    }
                },
                clear_callback: function () {
                    $('.m-Template-Page-Background img').attr('src', '')
                    $('.btn-efar-upload').show()
                    $('.btn-efar-upload.remove').hide()
                }
            })


            $('#BtnSettingSave').click(function () {
                $(this).SettingSave()
            })
        },
        PaperSettings: function () {
            var PageCopy = $('#PageCopy')
            var PageSize = $('#PageSize')
            var PageProduct = $('#PageProduct')
            var PageType = $('#PageType')
            var CopyDirection = $('#CopyDirection')
            var PageWidth = $('#PageWidth')
            var PageHeight = $('#PageHeight')
            var Canvas = $('#PreviewCanvas')

            CopyDirection.parent().parent().hide()
            PageWidth.parent().parent().hide()
            PageHeight.parent().parent().hide()
            PageWidth.val('21,00')
            PageHeight.val('29,70')
            Canvas.canvasUpdate()

            PageCopy.on('change', function () {
                if ($(this).val() != '1') {
                    CopyDirection.parent().parent().show()
                    PageSize.parent().parent().hide()
                    PageType.parent().parent().hide()
                    PageWidth.parent().parent().show()
                    PageHeight.parent().parent().show()
                    PageSize.val('A4')
                    PageType.val('Dikey')
                } else {
                    CopyDirection.parent().parent().hide()
                    PageSize.parent().parent().show()
                    PageType.parent().parent().show()
                    PageWidth.parent().parent().hide()
                    PageHeight.parent().parent().hide()

                    PageSize.trigger('change')
                }
                Canvas.canvasUpdate()
            })

            PageSize.on('change', function () {
                PageWidth.val('21,00')
                PageHeight.val('29,70')
                if ($(this).val() == 'Özel') {
                    PageWidth.parent().parent().show()
                    PageHeight.parent().parent().show()
                    PageType.parent().parent().hide()

                } else {
                    PageWidth.parent().parent().hide()
                    PageHeight.parent().parent().hide()
                    PageType.parent().parent().show()

                    if ($(this).val() == 'A5') {
                        if (PageType.val() == 'Dikey') {
                            PageWidth.val('14,80')
                            PageHeight.val('21,00')
                        } else {
                            PageWidth.val('21,00')
                            PageHeight.val('14,80')
                        }
                    }
                }
                Canvas.canvasUpdate()
            })

            PageType.on('change', function () {
                w = PageWidth.val()
                h = PageHeight.val()
                if ($(this).val() == 'Dikey') {
                    PageWidth.val(w >= h ? h : w)
                    PageHeight.val(w >= h ? w : h)
                } else {
                    PageWidth.val(w <= h ? h : w)
                    PageHeight.val(w <= h ? w : h)
                }
                Canvas.canvasUpdate()
            })

            CopyDirection.on('change', function () {
                Canvas.canvasUpdate()
            })

            PageWidth.on('keyup keypress', function () {
                Canvas.canvasUpdate()
            })

            PageHeight.on('keyup keypress', function () {
                Canvas.canvasUpdate()
            })

            $('.btn-efar-upload.remove').click(function () {
                var imageUrl = $('.m-Template-Page-Background img').attr('src')
                $.ajax({
                    type: 'post',
                    url: '/settings/TemplateImageRemove',
                    data: { imageUrl: imageUrl },
                    success: function (data) {
                        if (data == 'success') {
                            $('.m-Template-Page-Background img').attr('src', '')
                            $('.btn-efar-upload').show()
                            $('.btn-efar-upload.remove').hide()
                            $('.efar-image-preview').css('background-image', 'none')
                            $('#image-upload').val('')
                        }
                    }
                })
            })

        },
        canvasUpdate: function () {
            var Pgwidth = $('#PageWidth').val()
            if(Pgwidth!=undefined){
                var PageWidth = parseFloat($('#PageWidth').val().replace(',', '.'))
                var PageHeight = parseFloat($('#PageHeight').val().replace(',', '.'))
                var PageCopy = parseFloat($('#PageCopy').val())
                var CopyDirection = $('#CopyDirection').val()
	
	
                if (CopyDirection == 'Altalta') {
                    PageHeight = PageHeight * PageCopy
	
                } else {
                    PageWidth = PageWidth * PageCopy
                }
	
                var w = 150, h = 150
                if (PageWidth > PageHeight) {
                    w = 150
                    h = parseFloat(PageHeight * 150 / PageWidth).toFixed(2)
                } else if (PageHeight > PageWidth) {
                    h = 150
                    w = parseFloat(PageWidth * 150 / PageHeight).toFixed(2)
                }
	
	
                $('#image-preview').css({ width: w, height: h })
                $(this).clearCanvas()
	
                for (var i = 0; i < PageCopy; i++) {
	
                    var x = 0, y = 0, hNew = h, wNew = w
                    if (CopyDirection == 'Altalta') {
                        hNew = h / PageCopy
                        y = (hNew * i)
	
                    } else {
                        wNew = w / PageCopy
                        x = (wNew * i)
                    }
	
                    $(this).drawRect({
                        fillStyle: 'transparent',
                        strokeStyle: 'red',
                        strokeWidth: 1,
                        x: x, y: y,
                        fromCenter: false,
                        width: wNew,
                        height: hNew
                    })
                }
            }
			

        },
        calculateCanvas: function (w, h) {
            if (PageWidth > PageHeight) {
                w = 150
                h = parseFloat(PageHeight * 150 / PageWidth).toFixed(2)
            } else if (PageHeight > PageWidth) {
                h = 150
                w = parseFloat(PageWidth * 150 / PageHeight).toFixed(2)
            }
        },
        SettingSave: function () {
            var Printer = $('input[name=Printer]:checked').attr('id')
            var PageCopy = $('#PageCopy').val()
            var PageSize = $('#PageSize').val()
            var PageType = $('#PageType').val()
            var PageProduct = $('#PageProduct').val()
            var CopyDirection = $('#CopyDirection').val()
            var PageWidth = $('#PageWidth').val()
            var PageHeight = $('#PageHeight').val()
            var ImageUrl = $('.m-Template-Page-Background img').attr('src')
            var JsonSettings = {
                Printer: Printer,
                PageCopy: PageCopy,
                PageProduct: PageProduct,
                PageSize: PageSize,
                PageType: PageType,
                CopyDirection: CopyDirection,
                PageWidth: PageWidth,
                PageHeight: PageHeight,
                ImageUrl: ImageUrl
            }
            $('#JsonSettings').val(JSON.stringify(JsonSettings))
            $('#PopupSettings').modal('hide')
            $('#JsonSettings').ruler()
        },

        ruler: function () {
            var JsonSettings = JSON.parse($(this).val())
            var PageWidthCm = parseFloat(JsonSettings.PageWidth.replace(',', '.'))
            var PageHeightCm = parseFloat(JsonSettings.PageHeight.replace(',', '.'))

            var RulerTop = $('.m-Ruler-Top ul')
            var RulerLeft = $('.m-Ruler-Left ul')

            RulerTop.html('')
            var i =0
            for ( i = 0; i < Math.ceil(PageWidthCm); i++) {
                RulerTop.append('<li><span>' + i + '</span></li>')
            }
            RulerTop.append('<div class=\'clear\'></div>')
            RulerLeft.html('')
            for ( i = 0; i < Math.ceil(PageHeightCm); i++) {
                RulerLeft.append('<li><span>' + i + '</span></li>')
            }

            var PageWidth = $(this).CmtoPixel(PageWidthCm)
            var PageHeight = $(this).CmtoPixel(PageHeightCm)
            RulerTop.css({ width: PageWidth })
            RulerTop.parent().css({ width: PageWidth })
            RulerLeft.css({ height: (parseFloat(PageHeight) + 50) })
            $('.m-Template-Page').css({ width: PageWidth, height: PageHeight })

        },
        PrintPopup: function () {
            $('#PopupPrint').modal({ backdrop: 'static', keyboard: false })
        },
        Print: function () {
            $('#JsonData').val(JSON.stringify(getJsonData()))
            var JsonData = JSON.parse($('#JsonData').val())
            var JsonSettings = JSON.parse($('#JsonSettings').val())
            //clear null values
            JsonData = JsonData.filter(function (elem) {
                return elem.ItemTitle != 'null'
            })

            PdfLoad(JsonData, JsonSettings, $jsonTableData)
            $('#PopupPrint').modal('hide')
        },

        //Buradan sonraki Fonksiyonlar Düzenleme Sayfası için  
        setPage: function () {
            var Page = $('.m-Template-Page-Area')
            var JsonData = JSON.parse($('#JsonData').val())
            $.each(JsonData, function (index, item) {
                if (item.ItemType != 'TableField') {
                    $('.m-Tool ul li[data-key="' + item.ItemKey + '"]').setItem(Page, item)
                }
            })
            $(this).pageLoad()
        },
        setSettings: function () {
            $(this).PaperSettings()
            var JsonSettings = JSON.parse($('#JsonSettings').val())
            var PageCopy = $('#PageCopy')
            var PageProduct = $('#PageProduct')
            var PageSize = $('#PageSize')
            var PageType = $('#PageType')
            var CopyDirection = $('#CopyDirection')
            var PageWidth = $('#PageWidth')
            var PageHeight = $('#PageHeight')
            var Canvas = $('#PreviewCanvas')

            PageProduct.val(JsonSettings.PageProduct)


            PageCopy.val(JsonSettings.PageCopy)
            PageCopy.trigger('change')

            CopyDirection.val(JsonSettings.CopyDirection)
            PageSize.val(JsonSettings.PageSize)
            PageType.val(JsonSettings.PageType)

            if (JsonSettings.PageCopy > 1) {
                CopyDirection.trigger('change')
            } else {
                PageSize.trigger('change')
            }

            PageWidth.val(JsonSettings.PageWidth)

            PageHeight.val(JsonSettings.PageHeight)


            var ImageUrl = JsonSettings.ImageUrl
            if (ImageUrl != '') {
                $('.btn-efar-upload').hide()
                $('.btn-efar-upload.remove').show()
            }

            $('.m-Template-Page-Background img').attr('src', ImageUrl)
            $('#image-preview').css({ 'background-image': 'url(' + ImageUrl + ')', 'background-size': 'cover', 'background-position': 'center center' })

            $(this).SettingSave()
        },
        setItem: function (page, ui) {
            Key = $(this).data('key')
            TableKey = $(this).data('tablekey')
            Type = $(this).data('type')
            Value = $(this).data('value')
            Title = $(this).text().trim()
            Format = $(this).data('format')

            var item = '<div>' + Value + '</div>'

            if (ui.ItemType == 'CustomText') {
                Key = ui.ItemKey
                Value = ui.ItemValue
                Type = ui.ItemType
                Title = ui.ItemTitle

                item = '<div> <textarea class=\'efar-field-textarea\'>' + Title + '</textarea> <span> ' + Title + '</span> <i class=\'fa fa-edit Edit\'></i> </div>'
                Key = Key + $.now()
            } else if (ui.ItemType == 'CustomImage') {
                Key = ui.ItemKey
                Value = ui.ItemValue
                Type = ui.ItemType
                Title = ui.ItemTitle

                Key = Key + $.now()
                item = '<div> <img src=\'' + Title + '\' alt=\'\' class=\'efar-field-image\' />  <i class=\'fa fa-upload Upload field-label\'></i>   <input type=\'file\'  class=\'field-file\' id=\'file-' + Key + '\' /> </div>'
            }

            /////
            $(item).addClass('efar-field').attr('data-key', Key).attr('data-tablekey', TableKey).attr('data-type', Type).attr('data-title', Title).attr('data-format', Format).attr('data-rowlength', ui.RowLength).attr('style', ui.Style).append('<i class=\'fa fa-times Remove\'></i>').appendTo(page)


            if (Type == 'Table') {
                $('.m-Tool ul li[data-subkey="' + Key + '"]').css('display', 'block')
                var Table = $('.efar-field[data-key="' + Key + '"]', page)
                var a = $('.m-Tool ul.sortable[data-item-count!="0"] li[data-tablekey="' + TableKey + '"]')
                $(a.parent()).attr('data-tablekey', TableKey)
                var ToolTable = $('.m-Tool ul.sortable[data-tablekey="' + TableKey + '"]')
                var JsonData = JSON.parse($('#JsonData').val())
                ToolTable.html('')
                JsonData.sort(function (a, b) {
                    return (a.Sort - b.Sort)
                })


                $.each(JsonData, function (index, item) {
                    if (item.ItemType == 'TableField' & item.TableKey == TableKey && item.SubItemKey == TableKey) {
                        ToolTable.append('<li class=\'' + (item.Status ? 'active' : '') + '\' data-tablekey=\'' + item.TableKey + '\' data-type=\'' + item.ItemType + '\' data-value=\'' + item.ItemValue + '\' data-key=\'' + item.ItemKey + '\' data-subkey=\'' + Key + '\' data-style=\'' + item.Style + '\' data-width=\'' + item.Width + '\' data-tabletype=\'' + item.TableType + '\' data-format=' + (item.Format == 'undefined' ? 'x' : item.Format) + '><span class=\'check\'></span> <i class=\'fa fa-arrows-v\'></i> ' + item.ItemTitle + ' </li>')

                    }
                })
                $('li', ToolTable).css('display', 'block')
                $ToolBox.selectToolsItem()
                Table.createTable(Key)
            }


            if (Type != 'Table') {
                //sürükle bıraktan sonra item kaybolmaması
                $(ui.draggable).css('background-color', 'rgba(3, 169, 244, 0.24);')
            }
            else if (Type != 'CustomText' & Type != 'CustomImage') {
                $(ui.draggable).hide()
            }

            //if (Type != "CustomText" & Type != "CustomImage") {
            //	$(this).hide();
            //}

            $('.efar-field[data-key="' + Key + '"]', page).editItem()
            $('.efar-field[data-key="' + Key + '"]', page).uploadItem()
        }
    })

    $('.m-Tool').Tools()
    $('.m-Template-Page-Area').Page()
    $('.Tool-Setting').Settings()
})

function getJsonData() {
    var JsonData = []
    var JsonTableData = []
    var curCheck = ''
    var Page = $('.m-Template-Page-Area')
    $('.efar-field', Page).each(function () {
        ItemTitle = $(this).text()
        if ($(this).data('type') == 'CustomText') {
            ItemTitle = $('.efar-field-textarea', this).val().trim()
        } else if ($(this).data('type') == 'CustomImage') {
            ItemTitle = $('.efar-field-image', this).attr('src')
        } else if ($(this).data('type') == 'Table') {
            ItemTitle = ''
            RowLength = $(this).attr('data-rowlength')
        }
        if(ItemTitle!=null)
            JsonData.push({
                TableKey: $(this).data('tablekey'),
                ItemKey: $(this).data('key'),
                ItemType: $(this).data('type'),
                ItemValue: ItemTitle.trim(), // $(this).data("value"),
                ItemTitle: ItemTitle.trim(),
                Style: $(this).attr('style'),
                Sort: 0,
                Format: $(this).data('format'),
                //RowLength: RowLengthh

            })
        if ($(this).data('type') == 'Table') {
            $('.m-Tool ul.sortable li[data-subkey="' + $(this).data('key') + '"]').each(function (index, item) {
                JsonTableData.push({
                    TableKey: $(this).data('tablekey'),
                    ItemKey: $(this).data('key'),
                    SubItemKey: $(this).data('subkey'),
                    ItemType: $(this).data('type'),
                    ItemValue: $(this).data('value'),
                    ItemTitle: $(this).text().trim(),
                    TableType: $(this).data('tabletype'),
                    Style: $(this).data('style'),
                    Width: $(this).attr('data-width'),
                    Sort: index,
                    Status: $(this).hasClass('active'),
                    Format: $(this).data('format'),
                    RowLength: 0,
                    RowGroup: 0,
                    Height: 0,
                    Toolkey: 0,
                    Icon: null
                })

            })
        }


    })

    $jsonTableData = JsonTableData

    $.each(JsonTableData, function (i, v) {
        JsonData.push(v)
    })

    $.each(JsonData, function (i, v) {
        if (v.TableKey == 'CurrencyId') {
            curCheck = 1
            return false // stops the loop
        }
        else {
            curCheck = 0

        }
    })
    if (curCheck == 0) {
        //currency
        JsonData.push({
            TableKey: 'CurrencyId',
            ItemKey: 'CurrencyId',
            ItemType: 'Field',
            ItemValue: '1',
            ItemTitle: '1',
            Style: 'left: 1px; top: 1px; width: 1px; height: 1px; font-size: 12pt; font-family: roboto;display:none;',
            Sort: 0,
        })
    }

    //currency ile para birimini almak için, array ters çevirip currency id değerini ilk sıraya getiriyoruz
    JsonData.reverse()

    //null değerleri temizleme.
    JsonData = jQuery.grep(JsonData, function (n, i) {
        return (n.ItemValue != 'null' && n.ItemTitle != 'null')
    })
    console.log(JsonData)

    return JsonData
}





function TemplateSave() {
    var valid = $('#EfarForm').valid()
    if (valid) {
        var JsonData = getJsonData()
        $('#JsonData').val(JSON.stringify(JsonData))

    } else {
        $.alert.open('warning', 'Şablon Başlığı boş bırakılamaz')
    }
    return valid
}


