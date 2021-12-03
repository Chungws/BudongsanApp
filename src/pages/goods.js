import React, {Component} from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import firebase from '../firebase';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Good from '../components/good';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TableSortLabel from '@material-ui/core/TableSortLabel';


const drawerWidth = 240;
const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    width: '100%',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});

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
  return order === 'desc'
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
  { id: 'date', numeric: false, disablePadding: true, label: '날짜' },
  { id: 'division', numeric: false, disablePadding: true, label: '구분' },
  { id: 'address', numeric: false, disablePadding: true, label: '소재지' },
  { id: 'yongdo', numeric: false, disablePadding: true, label: '용도지역' },
  { id: 'landarea', numeric: true, disablePadding: false, label: '대지' },
  { id: 'totalprice', numeric: true, disablePadding: false, label: '매매가' },
  { id: 'deposit', numeric: true, disablePadding: false, label: '보증금' },
  { id: 'monthly', numeric: true, disablePadding: false, label: '월세' },
  { id: 'rentalstatus', numeric: false, disablePadding: true, label: '임대현황' },
  { id: 'estate', numeric: false, disablePadding: true, label: '부동산' },
  { id: 'etc', numeric: false, disablePadding: true, label: '비고' },
];

class EnhancedTableHead extends Component {
  //const { classes, order, orderBy, onRequestSort } = props;
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };
  render(){
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align='center'
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={this.props.orderBy === headCell.id ? this.props.order : false}
            >
              <TableSortLabel
                active={this.props.orderBy === headCell.id}
                direction={this.props.orderBy === headCell.id ? this.props.order : 'asc'}
                onClick={this.createSortHandler(headCell.id)}
              >
                {headCell.label}
                {this.props.orderBy === headCell.id ? (
                  <span className={this.props.classes.visuallyHidden}>
                    {this.props.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
}

class GoodsPageBase extends Component{
  constructor(props){
    super(props);
    this.state={
      rowList: [],
      searchKeyword:"",
      _open:false,
      order:'asc',
      orderBy:'address',
    }
  }
  handleRequestSort = (event, property) => {
    const isAsc = this.state.orderBy === property && this.state.order === 'asc';
    this.setState({order: isAsc ? 'desc' : 'asc'});
    this.setState({orderBy:property});
  };
  stateRefresh=()=> {
    this.setState({
      rowList: [],
      searchKeyword:"",
      _open:false,
      order:'asc',
      orderBy:'address',
    });
    this.showData()
  }

  componentDidMount(){
    this.timer = setInterval(this.progress, 20);
    this.showData()
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }
  
  render(){
    const filteredRows = (data) =>{
      data = data.filter((c)=>{
        return (c.address.indexOf(this.state.searchKeyword) && c.division.indexOf(this.state.searchKeyword) && c.estate.indexOf(this.state.searchKeyword) && c.etc.indexOf(this.state.searchKeyword) && c.yongdo.indexOf(this.state.searchKeyword) )  > -1;
      });
      return data.map((c)=>{
        return <Good stateRefresh={this.stateRefresh} row={c}/>
      });
    }
    const {classes, theme} = this.props;
    return (
      <div className={classes.root}>
      <AppBar position="fixed" className={clsx(classes.appBar, {[classes.appBarShift]: this.state._open,})}>
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={this.handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, this.state._open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            매물관리
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="검색"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              name="searchKeyword"
              value={this.state.searchKeyword}
              onChange={this.handleValueChange}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={this.state._open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button key={'메인'} component={Link} to="/">
            <ListItemText primary={'메인'} />
          </ListItem>
          <ListItem button key={'매물 입력'} component={Link} to="/goods/create">
            <ListItemText primary={'매물 입력'} />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: this.state._open,
        })}
      >
        <Paper className={classes.paper}>
          <h1></h1>
          <TableContainer component={Paper}>
            <Table size= "small" aria-label="a dense table">
              <EnhancedTableHead
                classes={classes}
                order={this.state.order}
                orderBy={this.state.orderBy}
                onRequestSort={this.handleRequestSort}
                rowCount={this.state.rowList.length}
                align="center"
              />
              <TableBody>
              {this.state.rowList ?
                filteredRows(stableSort(this.state.rowList, getComparator(this.state.order, this.state.orderBy))) :
                <TableRow>
                  <TableCell>
                    
                  </TableCell>
                </TableRow>
              }
            </TableBody>
            </Table>
          </TableContainer>
          </Paper>
        </main>
      </div>
    );
  }
  
  showData=()=> {
    return (
      firebase.database().ref(`/goods`).once('value').then((snapshot)=>{
        let rowList = [];

        snapshot.forEach(function(childSnapshot){
          const key = childSnapshot.key;
          const data = childSnapshot.val();

          rowList.push({key : key, 
            date: data.date,
            address: data.address,
            area: data.area,
            landarea: Number(data.area.landarea),
            price: data.price,
            totalprice: Number(data.price.totalprice),
            division: data.division,
            deposit: Number(data.deposit),
            monthly: Number(data.monthly),
            estate: data.estate,
            etc: data.etc,
            yongdo: data.yongdo,
            rentalstatus: data.rentalstatus,
          });
        })
        this.setState({rowList : rowList,});
      })
    );
  }

  handleValueChange = (e) =>{
    let nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }
  
  handleDrawerOpen = () => {
    this.setState({_open:true});
  };

  handleDrawerClose = () => {
    this.setState({_open:false});
  };
  
}

const GoodsPage = compose(
  withRouter,
)(GoodsPageBase);
  
export default withStyles(useStyles,{ withTheme: true })(GoodsPage);