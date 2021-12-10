import React, {Component} from 'react';
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

const Wrapper = Styled.div`
  width: 100vw;
  min-height: 100vh;
  margin: 0px;
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  background-color: #FFFFFF;
`
const LeftInfoWrapper = Styled.div`
  width: 90%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 30px;
  padding-top: 10px;
  padding-right: 20px;
`

const RightInfoWrapper = Styled.div`
  width: 10%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-left: 2.5%;
  padding-top: 10px;
  padding-right: 10px;
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

class GoodsUpdateBase extends Component{
  constructor(props){
    super(props);
    this.state={
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
      etc: ""
    }
  }

  componentDidMount(){
    this.timer = setInterval(this.progress, 20);
    this.showData(this.props.location.state.address);
  }
  render(){
    return(
      <ThemeProvider theme={theme}>
        <Wrapper>
          <LeftInfoWrapper>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <Typography variant="h4">매물 수정</Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
                <DesktopDatePicker
                  label={"일자"}
                  value={this.state.date}
                  placeholder={"연도.월.일"}
                  inputFormat={"yyyy.MM.dd"}
                  mask={"____.__.__"}
                  onChange={(newValue) => {
                    const dateFormat = dayjs(newValue).format("YYYY.MM.DD");
                    this.setState({date : dateFormat})
                  }}
                  renderInput={(params) => <TextField {...params} helperText={'연도(YYYY).월(MM).일(DD)'}/>}
                />
              </LocalizationProvider>
              <TextField id="standard-basic" name='division' label="구분" value={this.state.division} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='address' label="주소" required value={this.state.address} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='yongdo' label="용도지역" value={this.state.yongdo} onChange={this.onChange}></TextField>
              <p></p>
              <TextField id="standard-basic" name='landarea' label="대지" value={this.state.landarea} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='floorarea' label="연면적" value={this.state.floorarea} onChange={this.onChange}></TextField>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
                <DesktopDatePicker
                  label={"건축년도"}
                  value={this.state.years}
                  inputFormat={"yyyy.MM.dd"}
                  mask={"____.__.__"}
                  onChange={(newValue) => {
                    const dateFormat = dayjs(newValue).format("YYYY.MM.DD");
                    this.setState({years : dateFormat})
                  }}
                  renderInput={(params) => <TextField {...params} helperText={'연도(YYYY).월(MM).일(DD)'}/>}
                />
              </LocalizationProvider>
              <TextField id="standard-basic" name='floors' label="층수" value={this.state.floors} onChange={this.onChange}></TextField>
              <p></p>
              <TextField id="standard-basic" name='totalprice' label="매매가" value={this.state.totalprice} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='pyungprice' label="평단가" value={this.state.pyungprice} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='investment' label="실투자금" value={this.state.investment} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='loan' label="융자" value={this.state.loan} onChange={this.onChange}></TextField>
              <p></p>
              <TextField id="standard-basic" name='deposit' label="보증금" value={this.state.deposit} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='monthly' label="월세" value={this.state.monthly} onChange={this.onChange}></TextField>
              <p></p>
              <TextField id="standard-basic" name='statusbasement' label="지하" value={this.state.statusbasement} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='status1st' label="1층" value={this.state.status1st} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='status2nd' label="2층" value={this.state.status2nd} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='status3rd' label="3층" value={this.state.status3rd} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='status4th' label="4층" value={this.state.status4th} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='status5th' label="5층" value={this.state.status5th} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='status6th' label="6층" value={this.state.status6th} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='statusrooftop' label="옥탑" value={this.state.statusrooftop} onChange={this.onChange}></TextField>
              <p></p>
              <TextField id="standard-basic" name='estate' label="부동산" value={this.state.estate} onChange={this.onChange}></TextField>
              <TextField id="standard-basic" name='etc' label="비고" value={this.state.etc} onChange={this.onChange}></TextField>
            </Box>
          </LeftInfoWrapper>
          <RightInfoWrapper>
            <p/>
            <NavLink exact activeClassName="active" to="/goods" style={{ textDecoration: 'none' }}>
              <Button onClick={this.saveGoods} variant="contained">
                수정하기
              </Button>
            </NavLink>
            <p/>
            <NavLink exact activeClassName="active" to="/goods" style={{ textDecoration: 'none' }}>
              <Button variant="contained">
                돌아가기
              </Button>
            </NavLink>
          </RightInfoWrapper>
        </Wrapper>
      </ThemeProvider>
    );
  }

  showData=(address)=> {
    return (
      firebase.database().ref(`/goods/${address}`).once('value').then((snapshot)=>{
        this.setState({
          date: snapshot.val().date,
          yongdo: snapshot.val().yongdo,
          investment: snapshot.val().price.investment,
          loan: snapshot.val().price.loan,
          statusbasement: snapshot.val().rentalstatus.statusbasement,
          status1st: snapshot.val().rentalstatus.status1st,
          status2nd: snapshot.val().rentalstatus.status2nd,
          status3rd: snapshot.val().rentalstatus.status3rd,
          status4th: snapshot.val().rentalstatus.status4th,
          status5th: snapshot.val().rentalstatus.status5th,
          status6th: snapshot.val().rentalstatus.status6th,
          statusrooftop: snapshot.val().rentalstatus.statusrooftop,
          address : snapshot.val().address,
          division: snapshot.val().division,
          landarea: snapshot.val().area.landarea,
          floorarea: snapshot.val().area.floorarea,
          totalprice: snapshot.val().price.totalprice,
          pyungprice: snapshot.val().price.pyungprice,
          deposit: snapshot.val().deposit,
          monthly: snapshot.val().monthly,
          estate: snapshot.val().estate, 
          years: snapshot.val().area.years, 
          floors: snapshot.val().area.floors, 
          etc: snapshot.val().etc
        });
      })
    );
  }

  saveGoods = () => {
    firebase.database().ref(`goods/${this.state.address.replace(/^\s+|\s+$/gm,'')}`).update({
      date: this.state.date,
      division: this.state.division,
      address: this.state.address.replace(/^\s+|\s+$/gm,''),
      yongdo: this.state.yongdo,

      area:{
        landarea: this.state.landarea,
        floorarea: this.state.floorarea,
        years: this.state.years, 
        floors: this.state.floors, 
      },

      price:{
        totalprice: this.state.totalprice,
        pyungprice: this.state.pyungprice,
        investment: this.state.investment,
        loan: this.state.loan,
      },

      deposit: this.state.deposit,
      monthly: this.state.monthly,

      rentalstatus:{
        statusbasement: this.state.statusbasement,
        status1st: this.state.status1st,
        status2nd: this.state.status2nd,
        status3rd: this.state.status3rd,
        status4th: this.state.status4th,
        status5th: this.state.status5th,
        status6th: this.state.status6th,
        statusrooftop: this.state.statusrooftop,
      },

      estate: this.state.estate, 
      etc: this.state.etc
    })
    alert('수정되었습니다!')
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
}

const GoodsUpdatePage = compose(
  withRouter,
)(GoodsUpdateBase);
  
export default GoodsUpdatePage;