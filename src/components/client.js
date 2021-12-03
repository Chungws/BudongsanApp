import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ClientDelete from './clientDelete';
import {useHistory} from "react-router";

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});


export default function Client(props) {
  
  const classes = useRowStyles();
  const history = useHistory();
  const [Name, setName] = useState(props.row.name);
  //setAddress(props.row.address);

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell align="center">{props.row.name}</TableCell>
        <TableCell align="center">{props.row.phonenum}</TableCell> 
        <TableCell align="center">{props.row.division}</TableCell>
        <TableCell align="center">{Number(props.row.price)}</TableCell> 
        <TableCell align="center">{props.row.naeyong}</TableCell>
        <TableCell>
          <ClientDelete stateRefresh={props.stateRefresh} address={props.row.name}>
            삭제
          </ClientDelete>
        </TableCell>
        <TableCell width="50">
          <Button onClick={() => {history.push({
            pathname: "/clients/update",
            state: {name: Name}
          })}}>수정</Button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}