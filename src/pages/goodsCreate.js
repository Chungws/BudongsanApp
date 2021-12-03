import React, {Component} from 'react';
import Styled from 'styled-components';
import firebase from '../firebase';
//import {db, auth, functions, storage, firebase} from '../components/firebase';
import { withStyles } from '@material-ui/core/styles';
import { NavLink, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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

const useStyles = (theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
});

class GoodsCreateBase extends Component{
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
  
  render(){
    const {classes} = this.props;
    return(
      <Wrapper>
        <LeftInfoWrapper>
          <form className={classes.root} noValidate autoComplete="off">
          <h1>매물 입력</h1>
            <TextField id="standard-basic" name='date' label="일자" onChange={this.onChange}/>
            <TextField id="standard-basic" name='division' label="구분" onChange={this.onChange}/>
            <TextField id="standard-basic" name='address' label="주소" onChange={this.onChange}/>
            <TextField id="standard-basic" name='yongdo' label="용도지역" onChange={this.onChange}/>
            <p></p>
            <TextField id="standard-basic" name='landarea' label="대지" onChange={this.onChange}/>
            <TextField id="standard-basic" name='floorarea' label="연면적" onChange={this.onChange}/>
            <TextField id="standard-basic" name='years' label="건축년도" onChange={this.onChange}/>
            <TextField id="standard-basic" name='floors' label="층수" onChange={this.onChange}/>
            <p></p>
            <TextField id="standard-basic" name='totalprice' label="매매가" onChange={this.onChange}/>
            <TextField id="standard-basic" name='pyungprice' label="평단가" onChange={this.onChange}/>
            <TextField id="standard-basic" name='investment' label="실투자금" onChange={this.onChange}/>
            <TextField id="standard-basic" name='loan' label="융자" onChange={this.onChange}/>
            <p></p>
            <TextField id="standard-basic" name='deposit' label="보증금" onChange={this.onChange}/>
            <TextField id="standard-basic" name='monthly' label="월세" onChange={this.onChange}/>
            <p></p>
            <TextField id="standard-basic" name='statusbasement' label="지하" onChange={this.onChange}/>
            <TextField id="standard-basic" name='status1st' label="1층" onChange={this.onChange}/>
            <TextField id="standard-basic" name='status2nd' label="2층" onChange={this.onChange}/>
            <TextField id="standard-basic" name='status3rd' label="3층" onChange={this.onChange}/>
            <TextField id="standard-basic" name='status4th' label="4층" onChange={this.onChange}/>
            <TextField id="standard-basic" name='status5th' label="5층" onChange={this.onChange}/>
            <TextField id="standard-basic" name='status6th' label="6층" onChange={this.onChange}/>
            <TextField id="standard-basic" name='statusrooftop' label="옥탑" onChange={this.onChange}/>
            <p></p>
            <TextField id="standard-basic" name='estate' label="부동산" onChange={this.onChange}/>
            <TextField id="standard-basic" name='etc' label="비고" onChange={this.onChange}/>
          </form>
        </LeftInfoWrapper>
        <RightInfoWrapper>
          <p/>
          <NavLink exact activeClassName="active" to="/goods" style={{ textDecoration: 'none' }}>
            <Button onClick={this.saveGoods} variant="contained">
              저장
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
    );
  }

  saveGoods = () => {
    firebase.database().ref(`goods/${this.state.address}`).set({
      date: this.state.date,
      division: this.state.division,
      address: this.state.address,
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
    alert('저장되었습니다!')
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
}

const GoodsCreatePage = compose(
  withRouter,
)(GoodsCreateBase);
  
export default withStyles(useStyles)(GoodsCreatePage);