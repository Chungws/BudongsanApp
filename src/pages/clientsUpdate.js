import React, {Component} from 'react';
import Styled from 'styled-components';
import firebase from '../firebase';
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

class ClientsUpdateBase extends Component{
  constructor(props){
    super(props);
    this.state={
      name: "",
      phonenum: "",
      naeyong: "",
      division: "",
      price: "",
    }
    
  }
  componentDidMount(){
    this.timer = setInterval(this.progress, 20);
    this.showData(this.props.location.state.name);
  }
  render(){
    const {classes} = this.props;
    return(
      <Wrapper>
        <LeftInfoWrapper>
          <form className={classes.root} noValidate autoComplete="off">
          <h1>매물 수정</h1>
            <TextField id="standard-basic" name='name' label="성함" value={this.state.name} onChange={this.onChange}></TextField>
            <TextField id="standard-basic" name='phonenum' label="전화번호" value={this.state.phonenum} onChange={this.onChange}></TextField>
            <TextField id="standard-basic" name='division' label="구분" value={this.state.division} onChange={this.onChange}></TextField>
            <p></p>
            <TextField id="standard-basic" name='price' label="금액" value={this.state.price} onChange={this.onChange}></TextField>
            <TextField id="standard-basic" name='naeyong' label="내용" value={this.state.naeyong} onChange={this.onChange}></TextField>
          </form>
        </LeftInfoWrapper>
        <RightInfoWrapper>
          <p/>
          <NavLink exact activeClassName="active" to="/clients" style={{ textDecoration: 'none' }}>
            <Button onClick={this.saveClients} variant="contained">
              수정
            </Button>
          </NavLink>
          <p/>
          <NavLink exact activeClassName="active" to="/clients" style={{ textDecoration: 'none' }}>
            <Button variant="contained">
              돌아가기
            </Button>
          </NavLink>
        </RightInfoWrapper>
      </Wrapper>
    );
  }

  showData=(name)=> {
    return (
      firebase.database().ref(`/clients/${name}`).once('value').then((snapshot)=>{
        this.setState({
          name: snapshot.val().name,
          phonenum: snapshot.val().phonenum,
          naeyong: snapshot.val().naeyong,
          division: snapshot.val().division,
          price: snapshot.val().price,
        });
      })
    );
  }

  saveClients = () => {
    firebase.database().ref(`clients/${this.state.name}`).update({
      name: this.state.name,
      phonenum: this.state.phonenum,
      division: this.state.division,
      price: this.state.price,
      naeyong: this.state.naeyong,
    })
    alert('수정되었습니다!')
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
}

const ClientsUpdatePage = compose(
  withRouter,
)(ClientsUpdateBase);
  
export default withStyles(useStyles)(ClientsUpdatePage);