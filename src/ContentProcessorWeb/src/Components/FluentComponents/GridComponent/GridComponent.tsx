import React, { useState, useEffect } from "react";
import { FixedSizeList as List1, ListChildComponentProps } from "react-window";
import {
    FolderRegular,
    EditRegular,
    OpenRegular,
    DocumentRegular,
    PeopleRegular,
    DocumentPdfRegular,
    VideoRegular,
    ImageRegular,
    EditPersonFilled,
} from "@fluentui/react-icons";
import { Tooltip } from "@fluentui/react-components";
import { CaretDown16Filled, CaretUp16Filled, DocumentPdf16Filled ,DocumentQueueAdd20Regular } from "@fluentui/react-icons";

import {
    PresenceBadgeStatus,
    Avatar,
    useScrollbarWidth,
    useFluent,
    TableBody,
    TableCell,
    TableRow,
    Table,
    TableHeader,
    TableHeaderCell,
    TableCellLayout,
    TableSelectionCell,
    createTableColumn,
    useTableFeatures,
    useTableSelection,
    useTableSort,
    TableColumnId,
    TableRowData as RowStateBase,
    useTableColumnSizing_unstable
} from "@fluentui/react-components";

import './GridComponent.styles.scss';


import AutoSizer from "react-virtualized-auto-sizer";
import { fetchContentTableData /*, fetchTableData*/ } from "../../../Services/apiService";


import { useDispatch, useSelector,shallowEqual  } from 'react-redux';
import { RootState } from '../../../store';

import { setSelectedGridRow } from '../../../store/slices/leftPanelSlice';
import useFileType from "../../../Hooks/useFileType";

type Item = {
    fileName: {
        label: string;
        icon: JSX.Element;
    };
    imported: {
        label: string;
        //status: PresenceBadgeStatus;
    };
    status: {
        label: string;
        //timestamp: number;
    };
    processTime: {
        label: string;
        //icon: JSX.Element;
    };
    entityScore: {
        label: string;
        //icon: JSX.Element;
    };
    schemaScore: {
        label: string;
        //icon: JSX.Element;
    };
    processId: {
        label: string;
        //icon: JSX.Element;
    };
    lastModifiedBy: {
        label: string;
    }
    file_mime_type: {
        label: string;
    }
};

interface GridComponentProps {

}

interface TableRowData extends RowStateBase<Item> {
    onClick: (e: React.MouseEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    selected: boolean;
    appearance: "brand" | "none";
}

interface ReactWindowRenderFnProps extends ListChildComponentProps {
    data: TableRowData[];
    style: any;
    index: any;
}

const columns = [
    createTableColumn<Item>({
        columnId: "fileName",
        compare: (a, b) => {
            return a.fileName.label.localeCompare(b.fileName.label);
        },
    }),
    createTableColumn<Item>({
        columnId: "imported",
        compare: (a, b) => {
            const dateA = new Date(a.imported.label).getTime();
            const dateB = new Date(b.imported.label).getTime();
            return dateA - dateB; // Ascending order (oldest to newest)
        },
    }),
    createTableColumn<Item>({
        columnId: "status",
        compare: (a, b) => {
            return a.status.label.localeCompare(b.status.label);
        },
        renderHeaderCell: () => <><div className="centerAlign">Status</div></>,
    }),
    createTableColumn<Item>({
        columnId: "processTime",
        compare: (a, b) => {
            return a.processTime.label.localeCompare(b.processTime.label);
        },
    }),
    createTableColumn<Item>({
        columnId: "entityScore",
        compare: (a, b) => {
            return a.entityScore.label.localeCompare(b.entityScore.label);
        },
    }),
    createTableColumn<Item>({
        columnId: "schemaScore",
        compare: (a, b) => {
            return a.schemaScore.label.localeCompare(b.schemaScore.label);
        },
    }),
    createTableColumn<Item>({
        columnId: "processId",
        compare: (a, b) => {
            return a.processId.label.localeCompare(b.processId.label);
        },
    }),
];


const GridComponent: React.FC<GridComponentProps> = () => {

    const dispatch = useDispatch();

    const store = useSelector((state: RootState) => ({
        gridData: state.leftPanel.gridData,
        processId: state.leftPanel.processId
    }),shallowEqual 
    );

    const { targetDocument } = useFluent();
    const scrollbarWidth = useScrollbarWidth({ targetDocument });

    const [sortState, setSortState] = useState<{
        sortDirection: "ascending" | "descending";
        sortColumn: TableColumnId | undefined;
    }>({
        sortDirection: "ascending" as const,
        sortColumn: "file",
    });

    const [items, setItems] = useState<Item[]>([]); // State to store fetched items
    const [selectedRow, setSelectedRow] = useState<string | null>(null); // State to store selected row
    const { fileType, getMimeType } = useFileType(null);
    useEffect(() => {
        const getFIleImage = (mimeType:any,file : any)=>{
            if(mimeType ==="application/pdf") return <DocumentPdfRegular />
            const mType = getMimeType({name : file});
            switch(mType){
                case 'image/jpeg':
                case 'image/png':
                case 'image/gif': 
                case 'image/bmp': 
                return  <ImageRegular />

                case 'application/pdf':
                    return <DocumentPdfRegular />
                
                default :
                    return <DocumentQueueAdd20Regular />
            }
        }
        if (store.gridData.items.length > 0) {
            const items = store.gridData.items.map((item: any) => ({
                //fileName: { label: item.processed_file_name, icon: <DocumentPdfRegular /> },
                fileName: {
                    label: item.processed_file_name,
                    icon: getFIleImage(item.processed_file_mime_type, item.processed_file_name)
                },
                imported: { label: item.imported_time },
                status: { label: item.status },
                processTime: { label: item.processed_time ?? "..." },
                entityScore: { label: item.entity_score.toString() },
                schemaScore: { label: item.schema_score.toString() },
                processId: { label: item.process_id },
                lastModifiedBy: { label: item.last_modified_by },
            }));
            setItems(items);
            //setSelectedRow(items[0].processId.label);
            dispatch(setSelectedGridRow({ processId: items[0].processId.label, item: store.gridData.items[0] }))
        }

    }, [store.gridData])

    useEffect(() => {
        setSelectedRow(store.processId);
    }, [store.processId])

    const handleRowClick = (processId: string) => {
        const selectedItem = store.gridData.items.find((item: any) => item.process_id == processId)
        dispatch(setSelectedGridRow({ processId: processId, item: selectedItem }))
    }

    const columnSizingOptions = {
        fileName: {
            idealWidth: 300,
            minWidth: 150,
        },
        imported: {
            minWidth: 110,
            defaultWidth: 250,
        },

    };

    const {
        getRows,
        sort: { getSortDirection, toggleColumnSort, sort },
        selection: {
            allRowsSelected,
            someRowsSelected,
            toggleAllRows,
            toggleRow,
            isRowSelected,
        },
    } = useTableFeatures(
        {
            columns,
            items,
        },
        [
            useTableSelection({
                selectionMode: "multiselect",
                defaultSelectedItems: new Set([]),
            }),
            useTableSort({
                sortState,
                onSortChange: (e, nextSortState) => setSortState(nextSortState),
            }),

            // useTableColumnSizing_unstable({
            //   columnSizingOptions,
            //   autoFitColumns: false,
            // }),
        ]
    );

    const renderRoudedButton = (txt: string) => {
        return (
            <>
                <div title={txt} className="roundedBtn">
                    <span className={txt === 'Processed' ? 'ProcessedCls' : ''}>
                        {txt}
                    </span>
                </div>
            </>
        )
    }

    const renderProcessTimeInSeconds = (timeString: string) => {
        if (!timeString) {
            return <div className="columnCotainer centerAlign">...</div>;
        }

        const parts = timeString.split(":");
        if (parts.length !== 3) {
            return <div className="columnCotainer centerAlign">{timeString}</div>;
        }

        const [hours, minutes, seconds] = parts.map(Number);
        const totalSeconds = (hours * 3600 + minutes * 60 + seconds).toFixed(2);

        return <div className="columnCotainer centerAlign">{totalSeconds}s</div>;
    };

    const renderPercentage = (valueText: string, status: string) => {
        // Check if the value is a number
        const decimalValue = Number(valueText);
        if (isNaN(decimalValue) || status !== 'Completed') {
            return <div className="percentageContainer"><span className={"textClass"}>...</span></div>
        };

        const wholeValue = Math.round(decimalValue * 100);

        let color;
        let numberClass = '';

        // Apply color based on value
        if (wholeValue > 80) {
            color = '#359B35';
            numberClass = 'gClass'
        } else if (wholeValue >= 50 && wholeValue <= 80) {
            color = '#C19C00';
            numberClass = 'yClass'
        } else if (wholeValue >= 30 && wholeValue < 50) {
            color = '#FF5F3DE5';
            numberClass = 'oClass'
        } else {
            color = '#B10E1C';
            numberClass = 'rClass'
        }

        return (
            <>
                <div className="percentageContainer">
                    <span className={numberClass}>{wholeValue}%</span>
                    {(wholeValue > 50) ?
                        <CaretUp16Filled className={numberClass} />
                        :
                        <CaretDown16Filled className={numberClass} />
                    }
                </div>
            </>
        )
    }

    const calculateSchemaScore = (valueText: string, lastModifiedBy: string, status: string) => {
        if (lastModifiedBy === 'user') {
            return (
                <div className="percentageContainer">
                    <span className={"textClass"}>
                        <EditPersonFilled className="editPersonIcon" />Verified
                    </span>
                </div>
            );
        }
        return renderPercentage(valueText, status);
    }

    const rendertext = (text: any, type = '') => {
        if (type === 'date') {
            const date = new Date(text);
            const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`;
            return <div className="columnCotainer centerAlign">{formattedDate}</div>;
        }
        return (
            <><div className={type == 'center' ? "columnCotainer centerAlign" : "columnCotainer"} >{text}</div></>
        )
    }

    const rows: TableRowData[] = sort(getRows((row) => {
        const selected = isRowSelected(row.rowId);
        return {
            ...row,
            onClick: (e: React.MouseEvent) => toggleRow(e, row.rowId),
            onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === " ") {
                    e.preventDefault();
                    toggleRow(e, row.rowId);
                }
            },
            selected,
            appearance: selected ? ("brand" as const) : ("none" as const),
        };
    }));

    const RenderRow = ({ index, style, data }: ReactWindowRenderFnProps) => {
        const { item, selected, appearance, onClick, onKeyDown } = data[index];
        const isSelected = item.processId.label === selectedRow;
        return (
            <TableRow
                aria-rowindex={index + 2}
                style={style}
                key={item.fileName.label}
                onKeyDown={onKeyDown}
                onClick={() => handleRowClick(item.processId.label)}
                //onClick={onClick}
                //appearance={appearance}
                appearance={isSelected ? "brand" : "none"} // Change appearance based on selection
                className={isSelected ? "selectedRow" : ""}
            >
                {/* <TableSelectionCell
                    checked={selected}
                    className="col0"
                    checkboxIndicator={{ "aria-label": "Select row" }}
                /> */}
                <TableCell className="col1">
                    <Tooltip content={item.fileName.label} relationship="label">
                        <TableCellLayout truncate media={item.fileName.icon}>
                            {item.fileName.label}
                        </TableCellLayout>
                    </Tooltip>
                </TableCell>
                <TableCell className="col2">
                    {rendertext(item.imported.label, 'date')}
                </TableCell>
                <TableCell className="col3">
                    {renderRoudedButton(item.status.label)}
                </TableCell>
                <TableCell className="col4">
                    {renderProcessTimeInSeconds(item.processTime.label)}
                </TableCell>

                <TableCell className="col5">
                    {renderPercentage(item.entityScore.label, item.status.label)}
                </TableCell>

                <TableCell className="col6">
                    {calculateSchemaScore(item.schemaScore.label, item.lastModifiedBy.label, item.status.label)}
                </TableCell>

            </TableRow>
        );
    };

    const toggleAllKeydown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === " ") {
                toggleAllRows(e);
                e.preventDefault();
            }
        },
        [toggleAllRows]
    );

    const headerSortProps = (columnId: TableColumnId) => ({
        onClick: (e: React.MouseEvent) => toggleColumnSort(e, columnId),
        sortDirection: getSortDirection(columnId),
    });

    return (
        <div style={{height: '100vh'}}>
            <Table
                noNativeElements={true}
                sortable
                size="medium"
                aria-label="Table with selection"
                aria-rowcount={rows.length}
                style={{ minWidth: "100%",height:"100%" , display:"flex",flexDirection:"column" }}
            >
                <TableHeader>
                    <TableRow aria-rowindex={1}>
                        {/* <TableSelectionCell className="col0"
                            checked={
                                allRowsSelected ? true : someRowsSelected ? "mixed" : false
                            }
                            onClick={toggleAllRows}
                            onKeyDown={toggleAllKeydown}
                            checkboxIndicator={{ "aria-label": "Select all rows" }}
                        /> */}
                        <TableHeaderCell className="col1" {...headerSortProps("fileName")}>File name</TableHeaderCell>
                        <TableHeaderCell className="col2"  {...headerSortProps("imported")}>Imported</TableHeaderCell>
                        <TableHeaderCell className="col3"  {...headerSortProps("status")}>Status</TableHeaderCell>
                        <TableHeaderCell className="col4" {...headerSortProps("processTime")}>Process time</TableHeaderCell>
                        <TableHeaderCell className="col5" {...headerSortProps("entityScore")}>Entity score</TableHeaderCell>
                        <TableHeaderCell className="col6" {...headerSortProps("schemaScore")}>Schema score</TableHeaderCell>
                        {/** Scrollbar alignment for the header */}
                        <div role="presentation" style={{ width: scrollbarWidth }} />
                    </TableRow>
                </TableHeader>
                <TableBody style={{height:"100%"}}>
                    <div className="GridList">
                        <AutoSizer>
                            {({ height, width }) => (
                                <List1
                                    height={height}
                                    itemCount={items.length}
                                    itemSize={45}
                                    width="100%"
                                    itemData={rows}
                                >
                                    {RenderRow}
                                </List1>
                            )}
                        </AutoSizer>
                    </div>
                </TableBody>
            </Table>
        </div>
    );
};

export default GridComponent;