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
  const addressList = data.map((info) => {return info.id})
  
  React.useEffect(() => {
    setSearchResults(addressList);
  }, []);

  React.useEffect(() => {
    const results = addressList.filter((item) =>
      item.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [searchTerm]);
  
  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  return (
    <Wrapper>
      <Box sx={{ width: '95%', maxWidth: window.innerWidth, bgcolor: 'background.paper' }}>
        <Typography variant="h5" style={{margin : 8}}>매물 조회</Typography>
        <Fab sx={{position : 'absolute', bottom : 16, right : 16, zIndex : 'tooltip'}} color="primary" onClick={() => {history.push({ pathname: "/goods/manage", state: { address: '' } })}}>
          <AddIcon/>
        </Fab>
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
            width: '100%',
            m: (theme) => theme.spacing(1, 0, 1.5),
            '& .MuiSvgIcon-root': {
              mr: 0.5,
            },
            '& .MuiInput-underline:before': {
              borderBottom: 1,
              borderColor: 'divider',
            },
          }}
        />
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