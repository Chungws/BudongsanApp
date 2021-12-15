import React, {Component} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import NumberFormat from 'react-number-format';

class AreaInfoModal extends Component {
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
        <div style={{ display : 'inline'}}>
        <Typography style={{ display : 'inherit', cursor : 'pointer', fontSize : 'inherit', fontWeight : 'bold' }} color="inherit" onClick={this.handleClickOpen} align='right'>{<NumberFormat value={this.props.area.landarea} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale/>}</Typography>
        <Dialog onClose={this.handleClose} open={this.state.open} fullWidth>
          <DialogTitle onClose={this.handleClose}>
            추가 정보
          </DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              <p>대지 : {this.props.area.landarea}</p>
              <p>연면적 : {this.props.area.floorarea}</p>
              <p>건축년도 : {this.props.area.years}</p>
              <p>층수 : {this.props.area.floors}</p>
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
      
  export default AreaInfoModal;