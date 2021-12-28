import * as React from 'react';
import { useHistory } from "react-router";
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Styled from 'styled-components';
import { db } from '../firebase';
import NumberFormat from 'react-number-format';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  koKR
} from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

import AreaInfoModal from '../components/areaInfoModal';
import PriceInfoModal from '../components/priceInfoModal';
import RentalStatusInfoModal from '../components/rentalStatusInfoModal';
import DeleteButton from '../components/deleteWarningModal';
import ImageInfoModal from '../components/imageInfoModal';
import GoodsViewMobilePage from './mobile/mobileGoodsView';

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
  justify-content: center;
  background-color: white;
`

const columns = [
  { field: 'date', headerName: '날짜' , width: 100 },
  { field: 'division', headerName: '구분' , width: 120, renderCell: renderCellExpand },
  { field: 'address', headerName: '소재지' , width: 220, renderCell: renderCellExpand },
  { field: 'yongdo', headerName: '용도지역' , width: 100 },
  { field: 'area', headerName: '대지' , width: 100, renderCell: (params) => ( <ThemeProvider theme={theme}><AreaInfoModal area = {params.value}/></ThemeProvider> ), 
    align: 'right', headerAlign: 'right',
    sortComparator: (v1, v2, param1, param2) => (
      param1.api.getCellValue(param1.id, 'area').landarea -
      param2.api.getCellValue(param2.id, 'area').landarea
    )
  },
  { field: 'price', headerName: '매매가' , width: 110, renderCell: (params) => ( <ThemeProvider theme={theme}><PriceInfoModal price = {params.value}/></ThemeProvider> ),
    align: 'right', headerAlign: 'right',
    sortComparator: (v1, v2, param1, param2) => (
      param1.api.getCellValue(param1.id, 'price').totalprice -
      param2.api.getCellValue(param2.id, 'price').totalprice
    )
  },
  { field: 'deposit', headerName: '보증금' , width: 100, align: 'right', headerAlign: 'right', renderCell: (params) => ( <NumberFormat value={params.value} displayType={'text'} thousandSeparator={true} /> ) },
  { field: 'monthly', headerName: '월세' , width: 100, align: 'right', headerAlign: 'right', renderCell: (params) => ( <NumberFormat value={params.value} displayType={'text'} thousandSeparator={true} /> ) },
  { field: 'rentalstatus', headerName: '임대현황' , width: 120, align: 'center', headerAlign: 'center', sortable: false,
    renderCell: (params) => ( <ThemeProvider theme={theme}><RentalStatusInfoModal rentalstatus = {params.value}/></ThemeProvider> ) },
  { field: 'estate', headerName: '부동산', width: 100, sortable: false, renderCell: renderCellExpand },
  { field: 'etc', headerName: '비고' , width: 200, sortable: false, renderCell: renderCellExpand },
  { field: 'data', headerName: '자료', width: 80, align: 'center', headerAlign: 'center', sortable: false, 
    renderCell: (params) => ( <ThemeProvider theme={theme}><ImageInfoModal address={params.value}/></ThemeProvider> )}
];

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function isOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

const theme = createTheme({
  typography: {
    fontFamily: [
      'Nanum Gothic'
    ].join(','),
  },
  palette: {
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});

const GridCellExpand = React.memo(function GridCellExpand(props) {
  const { width, value } = props;
  const wrapper = React.useRef(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: 1,
        height: 1,
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});

function renderCellExpand(params) {
  return (
    <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
  );
}

function CustomToolbar(props) {
  const history = useHistory();
  let isButtonEnable = props.selectedGoods.length === 0 ? false : true;

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
        <Button color="primary" startIcon={<AddIcon />} style={{ fontSize: '13px' }}
          onClick={() => {
            window.sessionStorage.setItem('budongsanState', JSON.stringify(props.state))
            history.push({ pathname: "/goods/manage", state: { address: '' } })}}  
        >
          매물 추가
        </Button>
        <GridToolbarDensitySelector/>
        <Button color="primary" startIcon={<EditIcon />} style={{ fontSize: '13px' }} disabled={!isButtonEnable} 
          onClick={() => {
            window.sessionStorage.setItem('budongsanState', JSON.stringify(props.state))
            history.push({ pathname: "/goods/manage", state: { address: props.selectedGoods[0]} })}}
        >
          매물 수정
        </Button>
        <DeleteButton refresh={props.getDataFromFirebase} addresses={props.selectedGoods} disabled={!isButtonEnable} isMobile={false}/>
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

function GoodsViewPageBase() {
  const [searchText, setSearchText] = React.useState('');
  const [sortStandard, setSortStandard] = React.useState({});
  const [selectedGoods, setSelectedGoods] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const useMutationObserver = (domNodeSelector, observerOptions, cb) => {
    React.useEffect(() => {
      const targetNode = document.querySelector(domNodeSelector);
      
      const observer = new MutationObserver(cb);
      
      observer.observe(targetNode, observerOptions);
      
      return () => {
        observer.disconnect();
      };
    }, [domNodeSelector, observerOptions, cb]);
  }
  
  const useSave = () => {    
    const handler = React.useCallback(mutationList => { 
      mutationList.forEach(mutation => {
        if (mutation.type === 'attributes' && (mutation.target.className.includes('sorted'))) {
          setSortStandard({ innerText : mutation.target.innerText, ariaSort : mutation.target.ariaSort })
        } else if (mutation.type === 'attributes' && mutation.target.className.includes('sortable')) {
          setSortStandard({ innerText : mutation.target.innerText, ariaSort : mutation.target.ariaSort })
        }
      });
    }, []);
  
    const config = {
      attributes: true,
      subtree: true,
    }
    
    useMutationObserver('html', config, handler);
  };
  
  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    getDataFromFirebase();
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  React.useEffect(() => {
    if (data.length > 0) {
      getSettings()
    }
  }, [data])

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  const getSettings = () => {
    if (window.sessionStorage.budongsanState) {
      const state = JSON.parse(window.sessionStorage.budongsanState);
      const text = state.searchText;
      const innerText = state.sortStandard.innerText;
      const ariaSort = state.sortStandard.ariaSort;
      
      setTimeout(function() {
        const headerList = document.querySelectorAll(".MuiDataGrid-columnHeader")
        requestSearch(text)
        headerList.forEach((header) => {
          if (header.innerText === innerText) {
            if (ariaSort === 'descending') {
              header.click()
              header.click()
            } else if (ariaSort === 'ascending') {
              header.click()
            }
          }
        })
      }, 1000)
    }
  }

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
    setLoading(true);
    db.ref(`/goods`).once('value')
    .then((snapshot)=>{
      let rowList = [];
      const goods = snapshot.val();
  
      Object.keys(goods).forEach((good) => {
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
          data: data.address
        });
      })
      return rowList
    })
    .then((result) => {
      setRows(result)
      setData(result)
      setLoading(false)
    })
  }

  useSave()

  if (windowSize.width < 700) {
    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          {loading ?
          <div style={{ display : 'flex', alignItems : 'center', justifyContent : 'center'}}> 
            <CircularProgress size={40}/>
          </div> :
            <GoodsViewMobilePage data={data} refresh={() => getDataFromFirebase()}/>
          }
        </Wrapper>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          {loading ? 
          <div style={{ display : 'flex', alignItems : 'center', justifyContent : 'center'}}> <CircularProgress size={40}/> </div> :
            <div style={{height: '100%', width: '100%'}}>
              <DataGrid
                components={{ Toolbar: CustomToolbar }}
                rows={rows}
                columns={columns}
                checkboxSelection
                disableSelectionOnClick
                disableColumnMenu
                localeText={koKR.components.MuiDataGrid.defaultProps.localeText}
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
                    getDataFromFirebase: () => getDataFromFirebase(),
                    state : { searchText : searchText, sortStandard : sortStandard }
                  },
                }}
              />
            </div>
          }
        </Wrapper>
      </ThemeProvider>
    );
  }
}

const GoodsViewPage = compose(
  withRouter,
)(GoodsViewPageBase);

export default GoodsViewPage;