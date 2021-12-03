import React, {Component} from 'react';
import Styled from 'styled-components';
import { NavLink, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import {auth } from "../firebase";


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
  background-color: #FFFFFF;
`

const ButtonContainer = Styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const MainText = Styled.p`
  font-size: 40px;
  font-weight: 600;
  font-family: Gothic;
  color: #000000;
`

const LinkButton = Styled.div`
  width: 90px;
  height: 80px;
  border-radius: 16px;
  background-color: ${props => props.bgColor};
  color: ${props => props.fontColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const LinkText = Styled.p`
  font-size: 22px;
  font-weight: 600;
  font-family: Gothic;
  margin: 0;
`
const InputContainer = Styled.div`
  width: 420px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`

const TextInputLabel = Styled.div`
  font-size: 15px;
  color: #BBBBBB;
  margin-top: 10px;
  margin-bottom: -10px;
  margin-left: 10px;
  justify-content: flex-start;
  flex-direction: row;
  display: flex;
`;

const TextInput = Styled.input`
  margin-top: 15px;
  margin-bottom: 10px;
  border-radius: 2px;
  width: 400px;
  height: 40px;
  border: 1px solid #e5e5e5;
  padding: 9px 12px;
  outline: none;
  box-sizing: border-box;
  background-color: #FFFFFF;
`

class MainPageBase extends Component{
  constructor(props){
    super();
    this.state = {
      email: "",
      password: "",
      passwordCheck: "",
      error: null,
      state: true,
    }
  }
  onLoginClick = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(this.state.email, this.state.password);
    } catch (error) {
      this.setState({error});
    }
    this.setState({state:false});
  };
  
  onLogOutClick = async () =>{
    await auth.signOut();
    this.setState({state:true});
  };
  render(){
    return(
      <Wrapper>
        <ButtonContainer style={{marginTop: '-5%'}}>
          <div style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF'}} />
          <div style={{width: 30}} />
          <div style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF'}} />
          <div style={{width: 30}} />
          <div style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF'}} />
          <div style={{width: 30}} />
          <div style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF'}} />
        </ButtonContainer>
        <MainText style={{marginTop: '2%'}}>부동산 관리</MainText>
        <div style={{height: 50}} />
        {auth.currentUser ? null :
        <InputContainer>
          <TextInputLabel style={{alignSelf: 'flex-start'}}>email</TextInputLabel>
          <TextInput 
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            type="text"
            placeholder="Emaill Address"
          />
          <TextInputLabel style={{alignSelf: 'flex-start'}}>password</TextInputLabel>
          <TextInput 
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </InputContainer>}
        {this.state.error && <p>{this.state.error.message}</p>}
        <ButtonContainer>
          {auth.currentUser ? 
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <LinkButton onClick={this.onLogOutClick} bgColor={"#f4abc4"} fontColor={"#333456"}>
                <LinkText>로그아웃</LinkText>
              </LinkButton>
              <div style={{width: 30}} />
              <NavLink exact activeClassName="active" to="/goods" style={{ textDecoration: 'none' }}>
                <LinkButton bgColor={"#f4abc4"} fontColor={"#333456"}>
                  <LinkText>매물관리</LinkText>
                </LinkButton>
              </NavLink>
              <div style={{width: 30}} />
              <NavLink exact activeClassName="active" to="/clients" style={{ textDecoration: 'none' }}>
                <LinkButton bgColor={"#f4abc4"} fontColor={"#333456"}>
                  <LinkText>고객관리</LinkText>
                </LinkButton>
              </NavLink>
            </div> : 
            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              <div style={{width: 30}} />
              <LinkButton onClick={this.onLoginClick} bgColor={"#f4abc4"} fontColor={"#333456"}>
                <LinkText>로그인</LinkText>
              </LinkButton>
            </div>
          }
        </ButtonContainer>
        <div style={{position: 'absolute', top: 20, right: 10}}>
          <p style={{color: '#000'}}>
            {auth.currentUser ? "로그인되었습니다" : "로그인해주세요"}
          </p>
        </div>
      </Wrapper>
    );
  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
}
const MainPage = compose(
  withRouter
)(MainPageBase);

export default MainPage;