import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

class GoodAreaInfo extends Component {
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
        <Button onClick={this.handleClickOpen} >{Number(this.props.area.landarea)}</Button>
        <Dialog onClose={this.handleClose} open={this.state.open} fullWidth="120">
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
      
  export default GoodAreaInfo;