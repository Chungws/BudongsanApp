import React, {Component} from 'react';
import firebase from '../firebase';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';


class DeleteWarningModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    }
  }
  
  deleteGoods = (addresses) => {
    let promises = [];
    
    addresses.map((address) => {
      promises.push(firebase.database().ref(`goods/${address}`).remove())
      firebase.storage().ref().child(`images/${address}`).listAll()
      .then((res) => {
        res.items.map((item) => {
          promises.push(firebase.storage().ref(`images/${address}/${item.name}`).delete())
        })
      })
      .catch((error) => {
        console.log(`There is no saved files in ${address} directory`, error)
      })
    })

    return Promise.all(promises)
    .then(()=> {
      this.handleClose();
      this.props.refresh();
    })
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    });
  }

  handleClose = () => {
    this.setState({
      open: false
    })
  }

  render() {
    return (
      <>
        <Button color="primary" startIcon={<DeleteIcon />} style={{ fontSize: '13px' }} disabled={this.props.disabled} onClick={this.handleClickOpen}>
          매물 삭제
        </Button>
        <Dialog onClose={this.handleClose} open={this.state.open}>
          <DialogTitle onClose={this.handleClose}>
            삭제 경고
          </DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              선택한 매물들이 삭제됩니다.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {this.deleteGoods(this.props.addresses)}}>
              삭제
            </Button>
            <Button variant="outlined" color="primary" onClick={this.handleClose}>닫기</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}
    
export default DeleteWarningModal;
    