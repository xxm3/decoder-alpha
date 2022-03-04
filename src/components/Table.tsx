import MaterialTable, { MaterialTableProps, } from '@material-table/core'
import { createTheme,  MuiThemeProvider, Paper, } from '@material-ui/core';
import { colorsByName } from '../theme/Theme';
import Style from './Style';


const blue = "#0000FF";
const red= "#FF0000";
const green = "#00FF00";



function Table<RowData extends object>(
    props: MaterialTableProps<RowData> & {
        columns: MaterialTableProps<RowData>['columns'];
    }
) {
	const theme = createTheme({
		palette: {
			background : {
				paper : "#01021A", // background color of table
			},
			text : {
				primary : colorsByName["primary"].contrast, // color of all normal text in the table
				secondary: "#c7c7ca", // the hover color of the column headers and the color of the text which shows which page the user is on
				disabled: red, // the hover color of the column headers and the color of the text which shows which page the user is on
			},
			action: {
				active: colorsByName["primary"].contrast, // color of action buttons such as next page, previous page, first oage, last page, cancel search
				disabled: colorsByName["primary"].contrast, // color of disabled action buttons
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

						.table-container {
							// border-width: 1px;
							padding: 1rem 0;
							border-radius: 0.25rem;
						}

						
						tbody tr:nth-child(even) {
							// background-color: rgba(var(--ion-color-primary-rgb), 0.075);
						}
						tbody tr:nth-child(odd) {
							background-color: rgba(var(--ion-color-primary-rgb), 0.15);
						}
						
						
					`}
				</Style>
	            <MaterialTable
	                {...props}
	                columns={props.columns.map((column) => ({
	                    ...column,
	                    cellStyle: { whiteSpace: "nowrap", borderBottom : "none", padding : 20},
	                }))}
					options={{ 
						headerStyle: { whiteSpace : "nowrap", borderBottom : "none",},
					}}
					components={{
						Container: (props) => <Paper {...props} className="table-container"/>,
					}}
	            />
	        </MuiThemeProvider>
    );
}

export default Table