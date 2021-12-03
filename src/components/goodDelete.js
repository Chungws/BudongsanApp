import React, {Component} from 'react';
import firebase from '../firebase';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';


class GoodDelete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }
  
  deleteGood(address){
    firebase.database().ref(`goods/${address}`).remove()
    this.props.stateRefresh();
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
      <Button variant="contained" color="secondary" onClick={this.handleClickOpen} size="small">
        삭제
      </Button>
      <Dialog onClose={this.handleClose} open={this.state.open}>
        <DialogTitle onClose={this.handleClose}>
          삭제 경고
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            선택한 매물이 삭제됩니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => {this.deleteGood(this.props.address)}}>
            삭제
          </Button>
          <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
        </DialogActions>
      </Dialog>
      </div>
    )
  }
}
    
export default GoodDelete;
    