import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  TextField,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { FilterList } from "@material-ui/icons";
import calendarPic from "../Assets/calendar.png";
import Axios from "axios";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "asc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "id", numeric: true, disablePadding: true, label: "ID" },
  { id: "center_id", numeric: false, disablePadding: true, label: "Center ID" },
  { id: "name", numeric: false, disablePadding: true, label: "Hospital" },
  { id: "vaccine", numeric: false, disablePadding: true, label: "Vaccine" },
  {
    id: "available_capacity",
    numeric: false,
    disablePadding: true,
    label: "Capacity",
  },
  { id: "min_age_limit", numeric: false, disablePadding: true, label: "Age" },
  { id: "fee_type", numeric: false, disablePadding: true, label: "Type" },
  { id: "fee", numeric: false, disablePadding: true, label: "Fee" },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="default"
            // align={headCell.numeric ? "right" : "left"}
            // padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedEmployee: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    Sessions,
    // selectedSession,
    SetPostalCode,
    SetDay,
    SetVaccine,
    SetAge,
    SetFeeType,
    ResetFilter,
  } = props;

  const _formatDate = async (value) => {
    let date = "";
    date = `${value.substring(8, 10)}-${value.substring(
      5,
      7
    )}-${value.substring(0, 4)}`;
    SetDay(date);
  };

  const _filterVaccine = (value) => {
    let filter = Sessions.filter((session) => session.vaccine === value);
    SetVaccine(filter);
  };

  const _filterAge = (value) => {
    let filter = Sessions.filter((session) => session.min_age_limit === value);
    SetAge(filter);
  };

  const _filterFeeType = (value) => {
    let filter = Sessions.filter((session) => session.fee_type === value);
    SetFeeType(filter);
  };

  return (
    <>
      <Typography
        className="text-center d-md-none"
        variant="h6"
        id="tableTitle"
        component="div"
      >
        COVID Vacination
      </Typography>
      <Toolbar
        className={`${clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })} justify-content-between`}
      >
        <Typography
          className={`${classes.title} d-none d-md-block`}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>

        <Typography
          className={`${classes.title} d-none d-md-block`}
          variant="h6"
          id="tableTitle"
          component="div"
          style={{ color: "#f50057" }}
        >
          COVID Vaccination
        </Typography>
        <TextField
          label="Postal Code"
          className="mr-3"
          onChange={(e) => SetPostalCode(e.target.value)}
          placeholder="Postal Code"
          variant="filled"
          size="small"
        />
        <TextField
          id="date"
          label="Day"
          type="date"
          defaultValue="2021-01-01"
          className={classes.textField}
          onChange={(e) => _formatDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Tooltip title="Filter">
          <IconButton
            aria-label="filter list"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <FilterList />
          </IconButton>
        </Tooltip>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <small
            className="dropdown-item"
            style={{ cursor: "pointer" }}
            onClick={ResetFilter}
          >
            Reset Filter
          </small>
          <small
            className="dropdown-item point"
            onClick={() => _filterVaccine("COVAXIN")}
          >
            COVAXIN
          </small>
          <small
            className="dropdown-item point"
            onClick={() => _filterVaccine("COVISHIELD")}
          >
            COVISHIELD
          </small>
          <small className="dropdown-item point" onClick={() => _filterAge(18)}>
            Age: 18+
          </small>
          <small
            className="dropdown-item point"
            style={{ cursor: "pointer" }}
            onClick={() => _filterAge(45)}
          >
            Age: 45+
          </small>
          <small
            className="dropdown-item point"
            onClick={() => _filterFeeType("Paid")}
          >
            Fee: PAID
          </small>
          <small
            className="dropdown-item point"
            onClick={() => _filterFeeType("Free")}
          >
            Fee: FREE
          </small>
        </div>
      </Toolbar>
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  Todos: PropTypes.array.isRequired,
  selectedTodo: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("id");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);
  const [AllData, setAllData] = React.useState([]);
  const [postalCode, setPostalCode] = React.useState("");
  const [day, setDay] = React.useState("");

  useEffect(() => {
    _initialFunction(postalCode, day);
  }, [postalCode, day]);

  const _initialFunction = async (code, date) => {
    if (code.length !== 6 || date === "") {
      return;
    }
    let { data } = await Axios.get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${code}&date=${date}`
    );
    let sessions = data.sessions.map((x, index) => ({ ...x, id: index + 1 }));
    console.log(sessions);
    setRows(sessions);
    setAllData(sessions);
  };

  const _setVaccine = (data) => {
    setRows(data);
  };

  const _setAge = (data) => {
    setRows(data);
  };

  const _setFeeType = (data) => {
    setRows(data);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // const emptyRows =
  //   rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          Sessions={AllData}
          selectedSession={selected}
          numSelected={selected.length}
          SetPostalCode={setPostalCode}
          SetDay={setDay}
          SetVaccine={_setVaccine}
          SetAge={_setAge}
          SetFeeType={_setFeeType}
          ResetFilter={() => setRows(AllData)}
        />
        {rows.length > 0 ? (
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                selectedEmployee={selected}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.title}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                            onClick={(event) =>
                              handleClick(event, row.title, row.id)
                            }
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="left"
                        >
                          {row.id}
                        </TableCell>
                        <TableCell align="left">{row.center_id}</TableCell>
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.vaccine}</TableCell>
                        <TableCell align="left">
                          {row.available_capacity}
                        </TableCell>
                        <TableCell align="left">{row.min_age_limit}+</TableCell>
                        <TableCell align="left">{row.fee_type}</TableCell>
                        <TableCell align="left">{row.fee}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className="text-center">
            <img
              className="img-fluid w-50"
              src={calendarPic}
              alt={"calendar"}
            />
            <h1 className="font-weight-light" style={{ fontSize: "4vw" }}>
              Please Enter Postal Code & Date Above
            </h1>
          </div>
        )}
        {rows.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </div>
  );
}
