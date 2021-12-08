import * as React from 'react';
import {useHistory} from "react-router";
import { withRouter, NavLink } from 'react-router-dom';
import { compose } from 'recompose';
import Styled from 'styled-components';
import firebase from '../firebase';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import AreaInfoModal from '../components/areaInfoModal';
import PriceInfoModal from '../components/priceInfoModal';
import RentalStatusInfoModal from '../components/rentalStatusInfoModal';
import DeleteButton from '../components/deleteWarningModal';

const Wrapper = Styled.div`
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  overflow: hidden;
  position: fixed;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: white;
`

const columns = [
  { field: 'date', headerName: '날짜' , width: 100 },
  { field: 'division', headerName: '구분' , width: 120 },
  { field: 'address', headerName: '소재지' , width: 220 },
  { field: 'yongdo', headerName: '용도지역' , width: 100 },
  { field: 'area', headerName: '대지' , width: 100, renderCell: (params) => ( <AreaInfoModal area = {params.value}/> ), 
    sortComparator: (v1, v2, param1, param2) => (
      param1.api.getCellValue(param1.id, 'area').landarea -
      param2.api.getCellValue(param2.id, 'area').landarea
    )
  },
  { field: 'price', headerName: '매매가' , width: 110, renderCell: (params) => ( <PriceInfoModal price = {params.value}/>),
    align: 'right', headerAlign: 'right',
    sortComparator: (v1, v2, param1, param2) => (
      param1.api.getCellValue(param1.id, 'price').totalprice -
      param2.api.getCellValue(param2.id, 'price').totalprice
    )
  },
  { field: 'deposit', headerName: '보증금' , width: 100, align: 'right', headerAlign: 'right' },
  { field: 'monthly', headerName: '월세' , width: 100, align: 'right', headerAlign: 'right' },
  { field: 'rentalstatus', headerName: '임대현황' , width: 120, align: 'center', headerAlign: 'center', sortable: false,
    renderCell: (params) => ( <RentalStatusInfoModal rentalstatus = {params.value}/> ) },
  { field: 'estate', headerName: '부동산', width: 130, sortable: false },
  { field: 'etc', headerName: '비고' , width: 200, sortable: false },
];

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function CustomToolbar(props) {
  const history = useHistory();
  let isButtonEnable = props.selectedGoods.length === 0 ? false : true;

  const stateRefresh = () => {
    console.log(props.selectedGoods[0])
    window.location.reload()
  }

  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <GridToolbarContainer>
        <NavLink exact activeClassName="active" to="/goods/create" style={{ textDecoration: 'none' }}>
          <Button color="primary" startIcon={<AddIcon />} style={{ fontSize: '13px' }}>
            매물 추가
          </Button>
        </NavLink>
        <GridToolbarDensitySelector/>
        <Button color="primary" startIcon={<EditIcon />} style={{ fontSize: '13px' }} disabled={!isButtonEnable} 
          onClick={() => {history.push({ pathname: "/goods/update", state: {address: props.selectedGoods[0]} })}}
        >
          매물 수정
        </Button>
        <DeleteButton stateRefresh={stateRefresh} addresses={props.selectedGoods} disabled={!isButtonEnable}/>
      </GridToolbarContainer>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="검색…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto',
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          '& .MuiSvgIcon-root': {
            mr: 0.5,
          },
          '& .MuiInput-underline:before': {
            borderBottom: 1,
            borderColor: 'divider',
          },
        }}
      />
    </Box>
  );
}

function GoodsPageBase() {

  const [searchText, setSearchText] = React.useState('');
  const [selectedGoods, setSelectedGoods] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    getDataFromFirebase();
  }, []);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = data.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };

  const getDataFromFirebase = () => {
    firebase.database().ref(`/goods`).once('value').then((snapshot)=>{
      let rowList = [];
      const goods = snapshot.val();
  
      Object.keys(goods).map((good) => {
        const id = good;
        const data = goods[good];
  
        rowList.push({
          id : id, 
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
      setRows(rowList)
      setData(rowList)
    })
  }

  return (
    <Wrapper>
      <div style={{height: '100%', width: '100%'}}>
        <DataGrid
          components={{ Toolbar: CustomToolbar }}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          disableColumnMenu
          rowsPerPageOptions = {[100]}
          onSelectionModelChange = {(newSelection) => {
            setSelectedGoods(newSelection)
          }}
          componentsProps={{
            toolbar: {
              value: searchText,
              selectedGoods: selectedGoods,
              onChange: (event) => requestSearch(event.target.value),
              clearSearch: () => requestSearch(''),
            },
          }}
        />
      </div>
    </Wrapper>
  );
}

const GoodsPage = compose(
  withRouter,
)(GoodsPageBase);

export default GoodsPage;