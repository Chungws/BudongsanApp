import React from 'react';
import Styled from 'styled-components';
import { db, storage } from '../firebase';
import { NavLink, withRouter, useLocation } from 'react-router-dom';
import { compose } from 'recompose';
import dayjs from 'dayjs';
import { ko } from 'date-fns/locale';
import NumberFormat from 'react-number-format';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import CircularProgress from '@mui/material/CircularProgress';
import ArticleIcon from '@mui/icons-material/Article';

import ImageUploadModal from '../components/imageUploadModal';

const Wrapper = Styled.div`
  width: ${window.innerWidth < 700 ? window.innerWidth*0.95 : '100%'};
  height: 100%;
  margin: 0px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
`
const ButtonWrapper = Styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`
const ImageListContainer = Styled.div`
  left: 0px;
  top: 0px;
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  align-content: space-around;
  justify-content: space-around;
  background-color: white;
`
const ImageContainer = Styled.div`
  height: 500px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`
const Image = Styled.img`
  height: 90%;
  margin: 10;
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

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
});

function GoodsManageBase() {
  const [state, setState] = React.useState({
    date: "",
    yongdo: "",
    investment: "",
    loan: "",
    statusbasement:"",
    status1st: "",
    status2nd: "",
    status3rd: "",
    status4th: "",
    status5th: "",
    status6th: "",
    statusrooftop: "",
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
  const [imageUrls, setImageUrls] = React.useState([]);
  const [documentUrls, setDocumentUrls] = React.useState([]);
  const [addressList, setAddressList] = React.useState([]);
  const [isValidAddress, setIsValidAddress] = React.useState(false);
  const [helpText, setHelpText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const files = React.useRef([]);
  const address = useLocation().state.address;
  const isUpdate = address ? true : false;
  

  React.useEffect(() => {
    if (isUpdate) {
      getFileUrls(address);
      getGoods(address);
    } else {
      getAddressList();
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  },[])

  React.useEffect(() => {
    const timeOutId = setTimeout(() => checkValidAddress(), 500);
    return () => clearTimeout(timeOutId);
  }, [state.address])

  const checkValidAddress = () => {
    const inValidAddressList = addressList.filter((elements) => elements !== address);
    if (state.address) {
      if (inValidAddressList.includes(state.address.replace(/^\s+|\s+$/gm,''))) {
        setIsValidAddress(false)
        setHelpText('?????? ????????? ???????????????')
      } else {
        setIsValidAddress(true)
        setHelpText('?????? ????????? ???????????????')
      }
    } else {
      setIsValidAddress(false)
      setHelpText('????????? ??????????????? ?????????')
    }
  }

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  const onChange = (event) => {
    setState((prevState) => ({...prevState, [event.target.name] : event.target.value}))
  }

  const getFiles = (updatedFiles) => {
    files.current = updatedFiles
  }

  const getFileUrls = (address) => {
    setLoading(true)
    storage.ref().child(`images/${address}`).listAll()
    .then((res) => {
      let promises = [];
      res.items.forEach((item) => {
        promises.push(item.getDownloadURL())
      })
      return Promise.all(promises)
    }).then((urls) => {
      let imageUrls = [];
      let documentUrls = [];
      urls.forEach((url) => {
        if (url.includes('.pdf') || url.includes('.hwp')) {
          documentUrls.push(url)
        } else {
          imageUrls.push(url)
        }
      })
      return {imageUrls : imageUrls, documentUrls : documentUrls}
    })
    .then((res) => {
      console.log('?????? ???????????? ??????')
      setLoading(false)
      setImageUrls(res.imageUrls)
      setDocumentUrls(res.documentUrls)
    })
    .catch((error) => {
      console.log('?????? ???????????? ??????')
    })
  }

  const saveGoods = () => {
    setLoading(true)
    let promises = [];

    promises.push(
      db.ref(`goods/${state.address.replace(/^\s+|\s+$/gm,'')}`)
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

    if (files.current) {
      files.current.forEach((file) => {
        if (file.type === 'application/pdf' || file.type === 'application/haansofthwp') {
          promises.push(
            storage.ref(`images/${state.address.replace(/^\s+|\s+$/gm,'')}/${file.name}`).put(file)
          )
        } else {
          const randomName = Math.random().toString(36).substring(2, 15);
          promises.push(
            storage.ref(`images/${state.address.replace(/^\s+|\s+$/gm,'')}/${randomName}`).put(file)
          )
        }
      })
    }

    return Promise.all(promises)
    .then(() => {
      setLoading(false)
      alert('?????? ??????!')
      window.location='/goods'
    })
    .catch(() => {
      setLoading(false)
      alert('?????? ??????!')
      window.location='/goods'
    })
  }

  const getAddressList = () => {
    db.ref(`goods`).once('value')
    .then((snap) => {
      if (snap && snap.val()) {
        const goodsList = snap.val();
        const addressListFromFirebase = Object.keys(goodsList);
        setAddressList(addressListFromFirebase)
      } else {
        console.log('There is no snap')
      }
    })
  }

  const getGoods = (address) => {
    setLoading(true)
    let promises = [];
    promises.push(
      db.ref(`/goods/${address}`).once('value')
      .then((snapshot)=>{
        if (snapshot && snapshot.val()) {
          const info = snapshot.val();
          setState({
            date: info.date,
            yongdo: info.yongdo,
            investment: info.price.investment,
            loan: info.price.loan,
            statusbasement: info.rentalstatus.statusbasement,
            status1st: info.rentalstatus.status1st,
            status2nd: info.rentalstatus.status2nd,
            status3rd: info.rentalstatus.status3rd,
            status4th: info.rentalstatus.status4th,
            status5th: info.rentalstatus.status5th,
            status6th: info.rentalstatus.status6th,
            statusrooftop: info.rentalstatus.statusrooftop,
            address : info.address,
            division: info.division,
            landarea: info.area.landarea,
            floorarea: info.area.floorarea,
            totalprice: info.price.totalprice,
            pyungprice: info.price.pyungprice,
            deposit: info.deposit,
            monthly: info.monthly,
            estate: info.estate, 
            years: info.area.years, 
            floors: info.area.floors, 
            etc: info.etc
          });
        } else {
          console.log('There is no snap')
        }
      })
    )
    
    return Promise.all(promises)
    .then(() => {
      setLoading(false)
      console.log('???????????? ??????!')
    })
    .catch(() => {
      setLoading(false)
      alert('???????????? ??????!')
      window.location='/goods'
    })
  }

  const deleteImage = (name) => {
    if (window.confirm('?????? ?????????????????????????')) {
      setLoading(true)
      storage.ref().child(`images/${address}/${name}`).delete()
      .then(() => {
        setLoading(false)
        alert(`?????? ?????? ?????? : ${name}`)
        getGoods(address)
      })
      .catch(() => {
        setLoading(false)
        alert(`?????? ?????? ?????? : ${name}`)
      })
    } else {
      getGoods(address)
    }
  }

  const getFileName = (url) => {
    const fileName = url.split('%2F')[2].split('?')[0]
    return fileName
  }

  return(
    <ThemeProvider theme={theme}>
      <Wrapper>
        { loading ? 
          <div style={{ display : 'flex', alignItems : 'center', justifyContent : 'center', height : windowSize.height}}> 
            <CircularProgress size={40}/>
          </div> :
          <>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: windowSize.width < 700 ? document.documentElement.clientWidth*0.95-16 : '25ch'},
                width: windowSize.width < 700 ? '95%' : 926.5,
              }}
              noValidate
              autoComplete="off"
            >
              <Typography variant={windowSize.width < 700 ? "h5" :"h4"} style={{margin : 8}}>?????? ??????</Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
                <DesktopDatePicker
                  label={"??????"}
                  value={state.date}
                  placeholder={"??????.???.???"}
                  inputFormat={"yyyy.MM.dd"}
                  mask={"____.__.__"}
                  onChange={(newValue) => {
                    const dateFormat = dayjs(newValue).format("YYYY.MM.DD");
                    setState((prevState) => ({...prevState, date : dateFormat}))
                  }}
                  renderInput={(params) => <TextField {...params} error={false} helperText={'??????(YYYY).???(MM).???(DD)'}/>}
                />
              </LocalizationProvider>
              <TextField name='division' label="??????" value = {state.division} onChange={onChange}/>
              <TextField name='address' required label="??????" value = {state.address} onChange={onChange} 
                helperText={isUpdate ? '????????? ????????? ??? ????????????' : helpText} error={!isValidAddress} disabled={isUpdate}/>
              <TextField name='yongdo' label="????????????" value = {state.yongdo} onChange={onChange}/>
              <p></p>
              <TextField name='landarea' label="??????" value = {state.landarea} onChange={onChange}/>
              <TextField name='floorarea' label="?????????" value = {state.floorarea} onChange={onChange}/>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
                <DesktopDatePicker
                  label={"????????????"}
                  value={state.years}
                  inputFormat={"yyyy.MM.dd"}
                  mask={"____.__.__"}
                  onChange={(newValue) => {
                    const dateFormat = dayjs(newValue).format("YYYY.MM.DD");
                    setState((prevState) => ({...prevState, years : dateFormat}))
                  }}
                  renderInput={(params) => <TextField {...params} error={false} helperText={'??????(YYYY).???(MM).???(DD)'}/>}
                />
              </LocalizationProvider>
              <TextField name='floors' label="??????" value = {state.floors} onChange={onChange}/>
              <p></p>
              <TextField name='totalprice' label="?????????" value = {state.totalprice} onChange={onChange} InputProps={{ inputComponent: NumberFormatCustom }}/>
              <TextField name='pyungprice' label="?????????" value = {state.pyungprice} onChange={onChange} InputProps={{ inputComponent: NumberFormatCustom }}/>
              <TextField name='investment' label="????????????" value = {state.investment} onChange={onChange} InputProps={{ inputComponent: NumberFormatCustom }}/>
              <TextField name='loan' label="??????" value = {state.loan} onChange={onChange} InputProps={{ inputComponent: NumberFormatCustom }}/>
              <p></p>
              <TextField name='deposit' label="?????????" value = {state.deposit} onChange={onChange} InputProps={{ inputComponent: NumberFormatCustom }}/>
              <TextField name='monthly' label="??????" value = {state.monthly} onChange={onChange} InputProps={{ inputComponent: NumberFormatCustom }}/>
              <TextField name='estate' label="?????????" value = {state.estate} onChange={onChange}/>
              <p></p>
              <TextField name='statusbasement' label="??????" value = {state.statusbasement} onChange={onChange}/>
              <TextField name='status1st' label="1???" value = {state.status1st} onChange={onChange}/>
              <TextField name='status2nd' label="2???" value = {state.status2nd} onChange={onChange}/>
              <TextField name='status3rd' label="3???" value = {state.status3rd} onChange={onChange}/>
              <TextField name='status4th' label="4???" value = {state.status4th} onChange={onChange}/>
              <TextField name='status5th' label="5???" value = {state.status5th} onChange={onChange}/>
              <TextField name='status6th' label="6???" value = {state.status6th} onChange={onChange}/>
              <TextField name='statusrooftop' label="??????" value = {state.statusrooftop} onChange={onChange}/>
              <p></p>
            </Box>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: windowSize.width < 700 ? document.documentElement.clientWidth*0.95-16 : 910.5 },
                width: windowSize.width < 700 ? '95%' : 926.5,
                maxWidth: '100%',
              }}
              noValidate
              autoComplete="off"
            >
              <TextField fullWidth multiline name='etc' label="??????" value={state.etc} onChange={onChange}/>
              <div style={{ height : 10}} />
              <TextField
                fullWidth
                variant="outlined"
                label={"?????? ?????????"}
                multiline
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputComponent: ({ inputRef, ...other }) => <div {...other} />
                }}
                inputProps={{ children: <ImageUploadModal name="images" getFiles={getFiles}/> }}
              />
              <div style={{ height : 10 }} />
              { isUpdate ? 
                <TextField
                  fullWidth
                  variant="outlined"
                  label={"????????? ??????"}
                  multiline
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    inputComponent: ({ inputRef, ...other }) => <div {...other} />
                  }}
                  inputProps={{ 
                    children: 
                    <ImageListContainer>
                      { imageUrls.length > 0 ?
                        imageUrls.map((url) => (
                          <ImageContainer>
                            <Image src={url} />
                            <div style={{ height : 5 }} />
                            <Button variant="contained" color="primary" onClick={() => deleteImage(getFileName(url))}>??????</Button>
                          </ImageContainer>
                        ))
                        : <Typography>????????? ????????? ????????????</Typography>
                      }
                      { documentUrls.length > 0 ?
                        documentUrls.map((url) => (
                          <ImageContainer style={{ justifyContent : 'flex-end'}}>
                            <ArticleIcon sx={{ width : 100, height : 100, margin : 'auto'}} src={url}/>
                            <Typography>{decodeURI(getFileName(url))}</Typography>
                            <Button variant="contained" color="primary" onClick={() => deleteImage(getFileName(url))}>??????</Button>
                          </ImageContainer>
                        ))
                        : <Typography>????????? ????????? ????????????</Typography>
                      }
                    </ImageListContainer>
                  }}
                /> : null
              }
              <ButtonWrapper>
                <Button variant="contained" disabled={state.address ? false : true} onClick={saveGoods}>
                  ????????????
                </Button>
                <div style={{ width : 10}} />
                <NavLink exact activeClassName="active" to="/goods" style={{ textDecoration: 'none' }}>
                  <Button variant="contained">
                    ????????????
                  </Button>
                </NavLink>
              </ButtonWrapper>
            </Box>
          </>
        }
      </Wrapper>
    </ThemeProvider>
  )
}

const GoodsManagePage = compose(
  withRouter,
)(GoodsManageBase);
  
export default GoodsManagePage;