import MaterialTable, { MaterialTableProps } from '@material-table/core'
import { createTheme,  MuiThemeProvider } from '@material-ui/core';
import { colorsByName } from '../theme/Theme';
import Style from './Style';
import Help from './Help';


const blue = "#0000FF";
const red= "#FF0000";
const green = "#00FF00";



function Table<RowData extends object>(
    props: MaterialTableProps<RowData> & {
        columns: MaterialTableProps<RowData>['columns'];
    } & { description ?: string; url ?: string;}
) {
	const theme = createTheme({
		palette: {
			background : {
				paper : "#01021A", // background color of table
			},
			text : {
				primary : colorsByName["primary"].contrast, // color of all normal text in the table
				secondary: "#d4d3d5", // the hover color of the column headers and the color of the text which shows which page the user is on
				 // the hover color of the column headers and the color of the text which shows which page the user is on
			},
			action: {
				active: colorsByName["primary"].contrast, // color of action buttons such as next page, previous page, first oage, last page, cancel search
				disabled: "#afaeb4", // color of disabled action buttons
				selected: "#1a1b30", // selected list item in dropdown
				hover: "#26273b", // hover color of list items in dropdown
				hoverOpacity: 0.1
			},
		}
	})
    return (
        <MuiThemeProvider theme={theme}>
            <Style>
                {`
						td.MuiTableCell-footer {
							border-bottom: none;
						}
						
						tbody tr[level="0"]:nth-child(even) {
							background-color: rgba(var(--ion-color-primary-rgb), 0.5);
						}
						tbody tr[level="0"]:nth-child(odd) {
							background-color: rgba(var(--ion-color-primary-rgb), 0.3);
						}		
						
						tr, td {
							border-bottom : none !important;
						}

						table {
							--tr-border-radius : 10px;
						}

						table:not(first-child){
							// margin-top: 20px;
						}
						table th{
						    padding: 5px !important;
						}
						tbody tr:first-child td:first-child {
							border-radius: var(--tr-border-radius) 0 0 0;
						}
						tbody tr:first-child td:last-child {
							border-radius: 0 var(--tr-border-radius) 0 0;
						}
						tbody tr:last-child td:first-child {
							border-radius: 0 0 0 var(--tr-border-radius);
						}
						tbody tr:last-child td:last-child {
							border-radius: 0 0 var(--tr-border-radius) 0;
						}

						.MuiToolbar-root {
							justify-content: space-between;
							width: 100%;
						}
					`}
            </Style>
            <MaterialTable
                {...props}
                columns={props.columns.map((column) => ({
                    ...column,
                    cellStyle: {
                        whiteSpace: 'nowrap',
                        borderBottom: 'none',
                        paddingTop: 14,
                        paddingBottom: 14,
						paddingLeft : 25,
						paddingRight: 20,
                    },
                }))}
                title={
                    <div className="flex space-x-2">
                        <p className="text-xl font-medium text-ellipsis" role="link" onClick={() => {
							props.url && window.open(props.url, "_blank")
						}}>{props.title}</p>
						{props.description && <Help description={props.description} />}
                    </div>
                }
                options={{
					headerStyle: {
						fontSize: '16px',
                        whiteSpace: 'nowrap',
                        borderBottom: 'none',
						paddingBottom : 25,
						...props.options?.headerStyle,
                    },
                    pageSize: 10, // default rows per page
                    emptyRowsWhenPaging: false,   // To avoid of having empty rows
                    pageSizeOptions: [10, 20, 50, 100],    // rows selection options
					...props.options,
                }}
            />
        </MuiThemeProvider>
    );
}

export default Table
