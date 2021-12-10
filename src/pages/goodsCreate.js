import React, {Component, useCallback} from 'react';
import Styled from 'styled-components';
import firebase from '../firebase';
//import {db, auth, functions, storage, firebase} from '../components/firebase';
import { NavLink, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import dayjs from 'dayjs';
import { ko } from 'date-fns/locale';
import ImageUploadModal from '../components/imageUploadModal';

const Wrapper = Styled.div`
  width: 100vw;
  min-height: 100vh;
  margin: 0px;
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
`
const ButtonWrapper = Styled.div`
  width: 1000;
  height: 150;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const theme = createTheme({
  typography: {
    fontFamily: [
      'Nanum Gothic'
    ].join(','),
    h4: {
      fontWeight: 700,
    },
  },
});

function GoodsCreateBase() {

  const [state, setState] = React.useState({
    date: "",
    yongdo: "",
    investment: "",
    loan: "",
    statusbasement:"",
    status1st:"",
    status2nd:"",
    status3rd:"",
    status4th:"",
    status5th:"",
    status6th:"",
    statusrooftop:"",
    address: "",
    division: "",
    landarea: "",
    floorarea: "",
    totalprice: "",
    pyungprice: "",
    deposit: "",
    monthly: "",
    estate: "", 
    years: "", 
    floors: "", 
    etc: "",
  });
  const images = React.useRef([]);

  const onChange = (event) => {
    setState((prevState) => ({...prevState, [event.target.name] : event.target.value}))
  }

  const getImages = (updatedImages) => {
    images.current = updatedImages
  }

  const saveGoods = () => {
    let promises = [];

    promises.push(
      firebase.database().ref(`goods/${state.address.replace(/^\s+|\s+$/gm,'')}`)
      .set({
        date: state.date,
        division: state.division,
        address: state.address.replace(/^\s+|\s+$/gm,''),
        yongdo: state.yongdo,

        area:{
          landarea: state.landarea,
          floorarea: state.floorarea,
          years: state.years, 
          floors: state.floors, 
        },

        price:{
          totalprice: state.totalprice,
          pyungprice: state.pyungprice,
          investment: state.investment,
          loan: state.loan,
        },

        deposit: state.deposit,
        monthly: state.monthly,

        rentalstatus:{
          statusbasement: state.statusbasement,
          status1st: state.status1st,
          status2nd: state.status2nd,
          status3rd: state.status3rd,
          status4th: state.status4th,
          status5th: state.status5th,
          status6th: state.status6th,
          statusrooftop: state.statusrooftop,
        },

        estate: state.estate, 
        etc: state.etc
      })
    )
    
    images.current.map((image, index) => {
      promises.push(
        firebase.storage().ref(`image/${state.address.replace(/^\s+|\s+$/gm,'')}/${index}`).put(image)
      )
    })

    return Promise.all(promises)
    .then(() => {
      alert('저장 성공!')
      window.location='/goods'
    })
    .catch(() => {
      alert('저장 실패!')
      window.location='/goods'
    })
  }

  return(
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch'},
            width: 1000,
            maxWidth: '100%',
          }}
          noValidate
          autoComplete="off"
        >
          <Typography variant="h4">매물 입력</Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
            <DesktopDatePicker
              label={"일자"}
              value={state.date}
              placeholder={"연도.월.일"}
              inputFormat={"yyyy.MM.dd"}
              mask={"____.__.__"}
              onChange={(newValue) => {
                const dateFormat = dayjs(newValue).format("YYYY.MM.DD");
                setState((prevState) => ({...prevState, date : dateFormat}))
              }}
              renderInput={(params) => <TextField {...params} helperText={'연도(YYYY).월(MM).일(DD)'}/>}
            />
          </LocalizationProvider>
          <TextField id="standard-basic" name='division' label="구분" onChange={onChange}/>
          <TextField id="standard-basic" name='address' required label="주소" onChange={onChange}/>
          <TextField id="standard-basic" name='yongdo' label="용도지역" onChange={onChange}/>
          <p></p>
          <TextField id="standard-basic" name='landarea' label="대지" onChange={onChange}/>
          <TextField id="standard-basic" name='floorarea' label="연면적" onChange={onChange}/>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
            <DesktopDatePicker
              label={"건축년도"}
              value={state.years}
              inputFormat={"yyyy.MM.dd"}
              mask={"____.__.__"}
              onChange={(newValue) => {
                const dateFormat = dayjs(newValue).format("YYYY.MM.DD");
                setState((prevState) => ({...prevState, years : dateFormat}))
              }}
              renderInput={(params) => <TextField {...params} helperText={'연도(YYYY).월(MM).일(DD)'}/>}
            />
          </LocalizationProvider>
          <TextField id="standard-basic" name='floors' label="층수" onChange={onChange}/>
          <p></p>
          <TextField id="standard-basic" name='totalprice' label="매매가" onChange={onChange}/>
          <TextField id="standard-basic" name='pyungprice' label="평단가" onChange={onChange}/>
          <TextField id="standard-basic" name='investment' label="실투자금" onChange={onChange}/>
          <TextField id="standard-basic" name='loan' label="융자" onChange={onChange}/>
          <p></p>
          <TextField id="standard-basic" name='deposit' label="보증금" onChange={onChange}/>
          <TextField id="standard-basic" name='monthly' label="월세" onChange={onChange}/>
          <TextField id="standard-basic" name='estate' label="부동산" onChange={onChange}/>
          <p></p>
          <TextField id="standard-basic" name='statusbasement' label="지하" onChange={onChange}/>
          <TextField id="standard-basic" name='status1st' label="1층" onChange={onChange}/>
          <TextField id="standard-basic" name='status2nd' label="2층" onChange={onChange}/>
          <TextField id="standard-basic" name='status3rd' label="3층" onChange={onChange}/>
          <TextField id="standard-basic" name='status4th' label="4층" onChange={onChange}/>
          <TextField id="standard-basic" name='status5th' label="5층" onChange={onChange}/>
          <TextField id="standard-basic" name='status6th' label="6층" onChange={onChange}/>
          <TextField id="standard-basic" name='statusrooftop' label="옥탑" onChange={onChange}/>
          <p></p>
        </Box>
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: 910.5 },
            width: 1000,
            maxWidth: '100%',
          }}
          noValidate
          autoComplete="off"
        >
          <TextField fullWidth id="standard-basic" name='etc' label="비고" onChange={onChange}/>
          <div style={{ height : 10}} />
          <TextField
            fullWidth
            variant="outlined"
            label={"사진 업로드"}
            multiline
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: ({ inputRef, ...other }) => <div {...other} />
            }}
            inputProps={{ children: <ImageUploadModal name="images" getImages={getImages}/> }}
          />
        </Box>
        <ButtonWrapper>
          <div style={{ width : 10}} />
          <Button variant="contained" disabled={state.address ? false : true} onClick={saveGoods}>
            저장하기
          </Button>
          <div style={{ width : 10}} />
          <NavLink exact activeClassName="active" to="/goods" style={{ textDecoration: 'none' }}>
            <Button variant="contained">
              돌아가기
            </Button>
          </NavLink>
        </ButtonWrapper>
      </Wrapper>
    </ThemeProvider>
  )
}

const GoodsCreatePage = compose(
  withRouter,
)(GoodsCreateBase);
  
export default GoodsCreatePage;