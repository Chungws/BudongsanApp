import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

class GoodRentalStatusInfo extends Component {
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
        <Button onClick={this.handleClickOpen} >임대현황</Button>
        <Dialog onClose={this.handleClose} open={this.state.open} fullWidth="120">
          <DialogTitle onClose={this.handleClose}>
            추가 정보
          </DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              <p>지하 : {this.props.rentalstatus.statusbasement}</p>
              <p>1층 : {this.props.rentalstatus.status1st}</p>
              <p>2층 : {this.props.rentalstatus.status2nd}</p>
              <p>3층 : {this.props.rentalstatus.status3rd}</p>
              <p>4층 : {this.props.rentalstatus.status4th}</p>
              <p>5층 : {this.props.rentalstatus.status5th}</p>
              <p>6층 : {this.props.rentalstatus.status6th}</p>
              <p>옥탑 : {this.props.rentalstatus.statusrooftop}</p>
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
      
  export default GoodRentalStatusInfo;