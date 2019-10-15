const State ={
    Cache:{
        Print:{
            width:0,
            height:0
        },
        Http:{
            Tools:'',
            PrintLoad:'',
            PrintSave:'',
            PrintSetting:''
        }
    },
    UI:{ //UISELECT
        DRAGCLASS: null,
        ACCORDIONID:null ,
        DROPID: null,
        TABLEROWCLASS:null,
        TABLECOLUMNCLASS:null,
        $CONTENT: null,
        $FONTSIZE:null,
        $FONTSTYLE:null,
        $FONTWEIGHT:null,
        TABLE:{
            CLASSNAME:'m-Tool'
        },
        SELECT:{
            $font:null
        },
        PANEL:{
            config:{
                up: 'fa-chevron-up',
                down: 'fa-chevron-down',
                extclass: 'h2',//Kullanımda deği
                activeClass: 'active',//Kullanımda deği
                container:'.m-Template-Tools',
                panelupclass:'fa fa-chevron-up',
                panelclass:'m-Tool'
            },
            
            Index:-1,
            Menu:[]
        }
    },
    Print:{
        PageCopy: 1,
        PageProduct: 1,
        PageSize: 'A4',
        PageType: 'Dikey',
        CopyDirection: 'Yanyana',
        PageWidth: '21,00',
        PageHeight: '29,70',
        ImageUrl: 'https://content.hesap365.com/content/891ebe11-0b0f-4609-84f6-15ba1143ed09/InvoiceTemplates/dbd01ae142e441d39826b47153f8c8c0.jpg'
    },
    Clone:{
        Type: {
            TEXT: {
                FIELD: 'Field',
                CUSTOMTEXT:'CustomText',
                CUSTOMIMAGE:'CustomImage',
                GROUPNAME: 'Field',
                VALUE: 'ItemValue',
                ITEMKEY: 'ItemKey',
                ITEMTITLE: 'ItemTitle',
                TABLEKEY:'TableKey',
                ITEMTYPE:'ItemType',
                ICON:'Icon'
            },
            TABLE: {
                DEFAULT: 'Table',
                FIELD: 'TableField',
                VALUE: 'ItemValue',
                ITEMKEY: 'ItemKey',
                ITEMTITLE: 'ItemTitle',
                SUBITEMKEY: 'SubItemKey',
                ITEMCOLUM: 'RowGroup',
                TABLEKEY:'TableKey',
                ITEMTYPE:'ItemType',
                ICON:'Icon'
            }
        },
        SelectElement: {
            DragSelect: 'm-drag-ul',
            TEXT: '#TextField',
            TABLE: '#TableField' /* It must be 'div' element */
        },
        Index: {
            Index: 0,
        },
        Items: {
            Tables:[],
            Clons:[],
            StaticItems:[]
        },
        GroupItems: {}
    },

}
export default State