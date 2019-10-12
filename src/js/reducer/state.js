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
        $CONTENT: null,
        $FONTSIZE:null,
        $FONTSTYLE:null,
        $FONTWEIGHT:null,
        SELECT:{
            $font:null
        },
        PANEL:{
            config:{
                up: 'fa-chevron-up',
                down: 'fa-chevron-down',
                extclass: 'h2',
                activeClass: 'active'
            },
            Index:-1,
            Menu:[]
        }
    },
    Print:{
        Printer: 'Laser',
        PageCopy: 1,
        PageProduct: 1,
        PageSize: 'A4',
        PageType: 'Dikey',
        CopyDirection: 'Yanyana',
        PageWidth: '21,00',
        PageHeight: '29,70',
        ImageUrl: ''
    },
    Clone:{
        Type: {
            TEXT: {
                FIELD: 'Field',
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