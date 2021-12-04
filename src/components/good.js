import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import DeleteWarningModal from './deleteWarningModal';
import AreaInfoModal from './areaInfoModal';
import PriceInfoModal from './priceInfoModal';
import RentalStatusInfoModal from './rentalStatusInfoModal';
import {useHistory} from "react-router";




const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});


export default function Good(props) {
  
  const classes = useRowStyles();
  const history = useHistory();
  const [Address, setAddress] = useState(props.row.address);
  //setAddress(props.row.address);

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell align="center" width="100">{props.row.date}</TableCell>
        <TableCell align="center" width="120">{props.row.division}</TableCell>
        <TableCell align="center" width="220">{props.row.address}</TableCell>
        <TableCell align="center" width="100">{props.row.yongdo}</TableCell>
        <TableCell align="center" width="100"><AreaInfoModal area = {props.row.area}/></TableCell>
        <TableCell align="center" width="110"><PriceInfoModal price = {props.row.price}/></TableCell> 
        <TableCell align="center" width="120">{Number(props.row.deposit)}</TableCell>
        <TableCell align="center" width="100">{Number(props.row.monthly)}</TableCell>
        <TableCell align="center" width="120"><RentalStatusInfoModal rentalstatus = {props.row.rentalstatus}/></TableCell>
        <TableCell align="center" width="100">{props.row.estate}</TableCell>
        <TableCell align="center" width="200">{props.row.etc}</TableCell>
        <TableCell width="30">
          <DeleteWarningModal stateRefresh={props.stateRefresh} address={props.row.address}>
            삭제
          </DeleteWarningModal>
        </TableCell>
        <TableCell width="30">
          <Button size="small" onClick={() => {history.push({
            pathname: "/goods/update",
            state: {address: Address}
          })}}>수정</Button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}