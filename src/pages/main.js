import React, {Component} from 'react';
import Styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { auth } from "../firebase";

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
`

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

const LoginBtn = Styled.button`
  height: 40px;
  font-size: 14px;
  padding: 13px 30px;
  cursor: pointer;
  background-color: #000;
  color: #FFFFFF;
  line-height: 1px;
  margin-top: 20px;
  margin-bottom: 12px;
  border-radius: 3px;
  border-style: none;
`

class MainPageBase extends Component{
  constructor(props){
    super();
    this.state = {
      email: "",
      password: "",
      error: null,
      isLogin: false,
    }
  }

  onSubmit = (event) => {
    const { email, password } = this.state;
    auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      this.setState({ isLogin : true });
    })
    .catch(error => {
      if (error.code === 'auth/invalid-email') {
        this.setState({ error: "유효하지 않은 이메일입니다." })
      } else if (error.code === 'auth/user-disabled') {
        this.setState({ error: "사용이 막힌 유저입니다." })
      } else if (error.code === 'auth/user-not-found') {
        this.setState({ error: "일치하는 유저가 없습니다." })
      } else if (error.code === 'auth/wrong-password') {
        this.setState({ error: "유효하지 않은 비밀번호입니다." })
      } else {
        this.setState({ error: error.message });
      }
    });
    event.preventDefault();
  };

  render(){
    const { isLogin } = this.state;
    return(
      <Wrapper>
        <MainText style={{marginTop: '2%'}}>부동산 매물 관리</MainText>
        <div style={{height: 50}} />
        {isLogin ? null :
        <InputContainer>
          <TextInputLabel style={{alignSelf: 'flex-start'}}>이메일</TextInputLabel>
          <TextInput 
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            type="text"
            placeholder="이메일"
          />
          <TextInputLabel style={{alignSelf: 'flex-start'}}>비밀번호</TextInputLabel>
          <TextInput 
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            type="password"
            placeholder="비밀번호"
          />
        </InputContainer>}
        {this.state.error && <p>{this.state.error.message}</p>}
        <ButtonContainer>
          {isLogin ? 
          <LoginBtn onClick={() => this.props.history.push('/goods')}>
            매물 조회
          </LoginBtn>
          :
          <LoginBtn onClick={this.onSubmit}>
            로그인
          </LoginBtn>
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
  }
}

const MainPage = compose(
  withRouter
)(MainPageBase);

export default MainPage;