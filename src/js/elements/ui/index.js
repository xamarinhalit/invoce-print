export const   CloneType= {
    TEXT: {
      FIELD: "Field",
      GROUPNAME: "Field",
      VALUE: "ItemValue",
      ITEMKEY: "ItemKey",
      ITEMTITLE: "ItemTitle"
    },
    TABLE: {
      DEFAULT: "Table",
      FIELD: "TableField",
      VALUE: "ItemValue",
      ITEMKEY: "ItemKey",
      ITEMTITLE: "ItemTitle",
      SUBITEMKEY: "SubItemKey",
      ITEMCOLUM: "RowGroup"
    }
  };
export const CloneSelectElement= {
  DragSelect: {
    ELEMENT: "m-drag-ul"
  },
  TEXT: {
    ELEMENT: "#TextField"
  },
  TABLE: {
    ELEMENT: "#TableField" /* It must be 'div' element */
  }
};

export const CloneIndex= {
  Index: 0,
  Table: {
    RowGroup: {},
    $RowGroup: {},
    CloneId: -1
  }
};
export const CloneItems= {
    Clons:[],
    StItems:[]
}
export const   GroupItems= {};