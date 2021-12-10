import React, {Component} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';

class PriceInfoModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false
      }
    }
  
    handleClickOpen=()=> {
      this.setState({
        open: true
      });
    }
  
    handleClose=()=> {
      this.setState({
        open: false
      })
    }
  
    render() {
      return (
        <div>
        <Button color="inherit" onClick={this.handleClickOpen} >{Number(this.props.price.totalprice)}</Button>
        <Dialog onClose={this.handleClose} open={this.state.open} fullWidth>
          <DialogTitle onClose={this.handleClose}>
            추가 정보
          </DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              <p>매매가 : {this.props.price.totalprice}</p>
              <p>평단가 : {this.props.price.pyungprice}</p>
              <p>실투자금 : {this.props.price.investment}</p>
              <p>융자 : {this.props.price.loan}</p>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
          </DialogActions>
        </Dialog>
        </div>
      )
    }
  }
      
  export default PriceInfoModal;