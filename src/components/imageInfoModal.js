import React, {Component} from 'react';
import { storage } from '../firebase';
import Styled from 'styled-components';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import ArticleIcon from '@mui/icons-material/Article';

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

class ImageInfoModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        imageUrls: [],
        documentUrls: [],
        open: false,
        loading: false,
      }
    }
  
    handleClickOpen=()=> {
      this.setState({
        open: true
      },() => this.getFileUrls(this.props.address));
    }
  
    handleClose=()=> {
      this.setState({
        open: false
      })
    }

    componentDidMount() {
      this.setState({ loading : true })
    }
  
    render() {
      const { imageUrls, documentUrls, loading } = this.state;

      return (
        <div>
          <IconButton onClick={this.handleClickOpen} aria-label="image">
            <SaveIcon />
          </IconButton>
          <Dialog onClose={this.handleClose} open={this.state.open} fullWidth maxWidth={imageUrls.length > 0 ? 'xl' : 'xs'} scroll='paper'>
            <DialogTitle onClose={this.handleClose}>
              사진
            </DialogTitle>
            <DialogContent>
              { loading ? 
                <div style={{ display : 'flex', alignItems : 'center', justifyContent : 'center'}}>
                  <CircularProgress size={40}/>
                </div> 
                :
                <ImageListContainer>
                  { imageUrls.length > 0 ?
                    imageUrls.map((url) => (
                      <ImageContainer>
                        <Image style={{ cursor : 'pointer' }} src={url} onClick={() => window.open(url, '_blank', `width=${window.innerWidth}, height=${window.innerHeight}`)}/>
                        <div style={{ height : 5 }} />
                        <Button variant="contained" color="primary" onClick={() => this.downloadImage(url)}>저장</Button>
                      </ImageContainer>
                    ))
                    : <Typography>저장된 사진이 없습니다</Typography>
                  }
                  { documentUrls.length > 0 ?
                    documentUrls.map((url) => (
                      <ImageContainer style={{ justifyContent : 'flex-end'}}>
                        <ArticleIcon sx={{ width : 400, height : 400, margin : 'auto', cursor : 'pointer' }} src={url} onClick={() => window.open(`/hwpview?${url}`, '_blank', `width=${window.innerWidth}, height=${window.innerHeight}`)}/>
                        <Typography>{decodeURI(this.getFileName(url))}</Typography>
                        <Button variant="contained" color="primary" onClick={() => this.downloadImage(url)}>저장</Button>
                      </ImageContainer>
                    ))
                    : <Typography>저장된 문서가 없습니다</Typography>
                  }
                </ImageListContainer>
              }
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
            </DialogActions>
          </Dialog>
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

    downloadImage = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = decodeURI(this.getFileName(url));
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
      };
      xhr.open('GET', url);
      xhr.send();
    }
  }
      
  export default ImageInfoModal;