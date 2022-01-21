import * as React from 'react';
import { useHistory } from "react-router";
import Styled from 'styled-components';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import MobileInfoModal from '../../components/mobile/mobileInfoModal';

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

export default function GoodsViewMobilePage({data, refresh}) {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [selectedDivision, setSelectedDivision] = React.useState('');
  const addressList = data.map((info) => {return info.id})
  
  React.useEffect(() => {
    setSearchResults(addressList);
  }, []);

  React.useEffect(() => {
    const results = data.filter((info) => 
      info.division.toLowerCase().includes(selectedDivision)
    ).filter((item) =>
      item.id.toLowerCase().includes(searchTerm)
    ).map((data) => {return data.id});
    setSearchResults(results);
  }, [searchTerm, selectedDivision]);
  
  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleChangeDivision = event => {
    setSelectedDivision(event.target.value);
  };

  return (
    <Wrapper>
      <Box sx={{ width: '95%', maxWidth: window.innerWidth, bgcolor: 'background.paper' }}>
        <Typography variant="h5" style={{margin : 8}}>매물 조회</Typography>
        <Fab sx={{position : 'absolute', bottom : 16, right : 16, zIndex : 'tooltip'}} color="primary" onClick={() => {history.push({ pathname: "/goods/manage", state: { address: '' } })}}>
          <AddIcon/>
        </Fab>
        <Box sx={{ display : 'flex', flexDirection : 'row', alignItems : 'center', justifyContent : 'space-between' }}>
          <TextField
            variant="standard"
            value={searchTerm}
            onChange={handleChange}
            placeholder="검색…"
            InputProps={{
              startAdornment: <SearchIcon />,
              endAdornment: (
                <IconButton
                  title="Clear"
                  aria-label="Clear"
                  size="small"
                  style={{ visibility: searchTerm ? 'visible' : 'hidden' }}
                  onClick={() => setSearchTerm('')}
                >
                  <ClearIcon />
                </IconButton>
              ),
            }}
            sx={{
              marginTop : 'auto',
              width : 'calc(100% - 128px)',
            }}
          />
          {/* <div style={{ width : 8 }} /> */}
          <FormControl fullWidth sx={{ width : 120 }}>
            <InputLabel>구분</InputLabel>
            <Select
              value={selectedDivision}
              label="구분"
              onChange={handleChangeDivision}
            >
              <MenuItem value={''}>전체</MenuItem>
              <MenuItem value={'건물'}>건물</MenuItem>
              <MenuItem value={'토지'}>토지</MenuItem>
              <MenuItem value={'빌딩'}>빌딩</MenuItem>
              <MenuItem value={'다가구'}>다가구</MenuItem>
              <MenuItem value={'상가'}>상가</MenuItem>
              <MenuItem value={'단독'}>단독</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <nav aria-label="goodslist">
          <List sx={{ maxHeight : window.innerHeight-122, position: 'relative', overflow: 'auto', }}>
            {
              searchResults.map((address) => {
                return(
                  <>
                    <ListItem>
                      <MobileInfoModal data={data.find((item) => item.id === address)} refresh={() => refresh()} />
                    </ListItem>
                    <Divider/>
                  </>
                )
              })
            }
          </List>
        </nav>
      </Box>
    </Wrapper>
  );
}