import React, {Component} from 'react';
import { storage } from '../../firebase';
import Styled from 'styled-components';
import NumberFormat from 'react-number-format';
import { withRouter } from "react-router-dom";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import ArticleIcon from '@mui/icons-material/Article';

import AreaInfoModal from '../areaInfoModal';
import PriceInfoModal from '../priceInfoModal';
import RentalStatusInfoModal from '../rentalStatusInfoModal';
import DeleteWarningModal from '../deleteWarningModal';

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
  width: auto;
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

class MobileInfoModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrls: [],
      documentUrls: [],
      open: false,
      loading: false,
    }
  }

  componentDidMount() {
    this.setState({ loading : true })
  }

  render() {
    const { imageUrls, documentUrls, loading } = this.state;

    return (
      <div style={{width : 'inherit'}}>
        <Button color='inherit' fullWidth onClick={this.handleClickOpen} style={{justifyContent: "flex-start", textTransform: 'none'}}>
          {this.props.data.id}
        </Button>
        <Dialog onClose={this.handleClose} open={this.state.open} fullWidth maxWidth={imageUrls.length > 0 || documentUrls.length > 0 ? 'xl' : 'xs'} scroll='paper'>
          <DialogTitle onClose={this.handleClose}>
            매물 정보
          </DialogTitle>
          <DialogContent>
            { loading ? 
              <div style={{ display : 'flex', alignItems : 'center', justifyContent : 'center'}}>
                <CircularProgress size={40}/>
              </div> 
              :
              <div>
                {this.renderInfo()}
                <div style={{height : 8}} />
                {this.renderFile()}
              </div>
            }
          </DialogContent>
          <DialogActions>
            <div style={{marginRight : 'auto'}}>
              <Button style={{marginRight : 8}} variant="outlined" color="primary" onClick={() => this.shareData()}>공유</Button>
              <DeleteWarningModal addresses={[this.props.data.address]} refresh={() => this.props.refresh()} disabled={false} isMobile={true}/>
              <Button style={{marginLeft : 8}} variant="outlined" color="primary" onClick={() => {this.props.history.push({ pathname: "/goods/manage", state: { address : this.props.data.address } })}}>수정</Button>
            </div>
            <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  renderFile = () => {
    const { documentUrls, imageUrls } = this.state;
    return (
      <ImageListContainer>
        { imageUrls.length > 0 ?
          imageUrls.map((url) => (
            <ImageContainer>
              <Image src={url} />
              <div style={{ height : 5 }} />
              <Button variant="contained" color="primary" onClick={() => this.downloadFile(url)}>저장</Button>
            </ImageContainer>
          ))
          : <Typography>사진이 없습니다</Typography>
        }
        <div style={{height : 8}} />
        { documentUrls.length > 0 ?
          documentUrls.map((url) => (
            <ImageContainer style={{ justifyContent : 'flex-end'}}>
              { url.includes('.pdf') ? 
                <ArticleIcon sx={{ width : 400, height : 400, margin : 'auto', cursor : 'pointer' }} src={url} onClick={() => window.open( url, '_blank', `width=${window.innerWidth}, height=${window.innerHeight}`)}/> : 
                <ArticleIcon sx={{ width : 400, height : 400, margin : 'auto', cursor : 'pointer' }} src={url} onClick={() => window.open(`/hwpview?${url}`, '_blank', `width=${window.innerWidth}, height=${window.innerHeight}`)}/>
              }
              <Typography>{decodeURI(this.getFileName(url))}</Typography>
              <Button variant="contained" color="primary" onClick={() => this.downloadFile(url)}>저장</Button>
            </ImageContainer>
          ))
          : <Typography>문서가 없습니다</Typography>
        }
      </ImageListContainer>
    )
  }
  
  renderInfo = () => {
    const { data } = this.props;
    return(
      <div>
        <Typography>
          날짜 : {data.date}
        </Typography>
        <Typography>
          구분 : {data.division}
        </Typography>
        <Typography>
          주소 : {data.address}
        </Typography>
        <Typography>
          용도지역 : {data.yongdo}
        </Typography>
        <Typography style={{display:'inline-block'}}>
          대지 :{'\u00A0'}
        </Typography>
        <AreaInfoModal area = {data.area}/>
        <br/>
        <Typography style={{display:'inline-block'}}>
          매매가 :{'\u00A0'}
        </Typography>
        <PriceInfoModal price = {data.price}/>
        <br/>
        <Typography>
          보증금 : <NumberFormat value={data.deposit} displayType={'text'} thousandSeparator={true} />
        </Typography>
        <Typography>
          월세 : <NumberFormat value={data.monthly} displayType={'text'} thousandSeparator={true} />
        </Typography>
        <RentalStatusInfoModal rentalstatus = {data.rentalstatus}/>
        <Typography>
          부동산 : {data.estate}
        </Typography>
        <Typography>
          비고 : {data.etc}
        </Typography>
      </div>
    )
  }

  getFileName = (url) => {
    const fileName = url.split('%2F')[2].split('?')[0]
    return fileName
  }

  getFileUrls = (address) => {
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
      console.log('파일 불러오기 성공')
      this.setState({ loading : false, imageUrls : res.imageUrls, documentUrls : res.documentUrls })
    })
    .catch((error) => {
      console.log('파일 불러오기 실패')
    })
  }

  downloadFile = (url) => {
    const fileName = url.split("%2F")[2].split('?')[0];
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function(event) {
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = decodeURI(fileName);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
    };
    xhr.open('GET', url);
    xhr.send();
  }

  shareData = async () => {
    const { data } = this.props;
    const imageFilesArray = await Promise.all(this.state.imageUrls.map((url) => {return (this.convertURLtoImageFile(url))}))
    const documentFilesArray = await Promise.all(this.state.documentUrls.filter((url) => url.includes('.pdf')).map((pdfurl) => {return (this.convertURLtoDocumentFile(pdfurl))}))
    const filesArray = imageFilesArray.concat(documentFilesArray);

    if (typeof navigator.share === 'undefined') {
      alert('공유하기를 지원하지 않는 환경입니다')
    } else {
      try {
        await navigator.share({
          title: `주소 : ${data.address}\n`,
          text: `용도 : ${data.yongdo}\n매매가 : ${data.price.totalprice}\n대지면적 : ${data.area.landarea}\n연면적 : ${data.area.floorarea}\n건축년도 : ${data.area.years}\n층수 : ${data.area.floors}\n보증금 : ${data.deposit}\n월세 : ${data.monthly}\n비고 : ${data.etc}`,
          files: filesArray
        });
        console.log('공유 성공')
      } catch (e) {
        console.log('공유 실패')
      }
    }
  }

  convertURLtoImageFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob();
    const filename = decodeURI(url.split("%2F")[2].split('?')[0]) + '.jpeg';
    return new File([data], filename, {type: 'image/jpeg'});
  }

  convertURLtoDocumentFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob();
    const type = url.includes('.pdf') ? 'application/pdf' : 'application/haansofthwp';
    const filename = decodeURI(url.split("%2F")[2].split('?')[0]);
    return new File([data], filename, {type: type});
  }
  
  handleClickOpen=()=> {
    this.setState({
      open: true
    },() => this.getFileUrls(this.props.data.address));
  }

  handleClose=()=> {
    this.setState({
      open: false
    })
  }
}

export default withRouter(MobileInfoModal);