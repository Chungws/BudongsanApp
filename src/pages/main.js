import React, {Component} from 'react';
import Styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { auth } from "../firebase";

const Wrapper = Styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0px;
  overflow: auto;
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
  width: ${window.innerWidth < 700 ? '95vw' : '420px'};
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
  width: ${window.innerWidth < 700 ? '90vw' : '400px'};
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
      width: 0,
      height: 0,
    }
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  onSubmit = (event) => {
    const { email, password } = this.state;
    auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      this.setState({ isLogin : true });
    })
    .catch(error => {
      if (error.code === 'auth/invalid-email') {
        this.setState({ error: "???????????? ?????? ??????????????????." })
      } else if (error.code === 'auth/user-disabled') {
        this.setState({ error: "????????? ?????? ???????????????." })
      } else if (error.code === 'auth/user-not-found') {
        this.setState({ error: "???????????? ????????? ????????????." })
      } else if (error.code === 'auth/wrong-password') {
        this.setState({ error: "???????????? ?????? ?????????????????????." })
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
        <MainText style={{marginTop: '2%'}}>????????? ?????? ??????</MainText>
        <div style={{height: 50}} />
        {isLogin ? null :
        <InputContainer>
          <TextInputLabel style={{alignSelf: 'flex-start'}}>?????????</TextInputLabel>
          <TextInput 
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            type="text"
            placeholder="?????????"
          />
          <TextInputLabel style={{alignSelf: 'flex-start'}}>????????????</TextInputLabel>
          <TextInput 
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            type="password"
            placeholder="????????????"
          />
        </InputContainer>}
        {this.state.error && <p>{this.state.error.message}</p>}
        <ButtonContainer>
          {isLogin ? 
          <LoginBtn onClick={() => this.props.history.push('/goods')}>
            ?????? ??????
          </LoginBtn>
          :
          <LoginBtn onClick={this.onSubmit}>
            ?????????
          </LoginBtn>
          }
        </ButtonContainer>
        <div style={{position: 'absolute', top: 20, right: 10}}>
          <p style={{color: '#000'}}>
            {isLogin ? "????????????????????????" : "?????????????????????"}
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