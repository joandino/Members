import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputMask from "react-input-mask";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UserManagement = () => {
    const [token, setToken] = useState("");
    const [members, setMembers] = useState([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [ssn, setSsn] = useState("");
    const [open, setOpen] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [errorForm, setErrorForm] = useState(false);
    const membersApiUrl = process.env.REACT_APP_MEMBERS_API_URL;
    const authBody = { "username" : "sarah", "password": "connor" };

    let timeout = null;

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setAddress("");
        setSsn("");
        setErrorForm(false);
    }

    const saveMember = async () => {
        if(firstName.trim().length <= 0) {
            setErrorMessage("First Name must not be empty, please fill it");
            setErrorForm(true);
            setOpen(true);

            return;
        } else if(lastName.trim().length <= 0) {
            setErrorMessage("Last Name must not be empty, please fill it");
            setErrorForm(true);
            setOpen(true);

            return;
        } else if(address.trim().length <= 0) {
            setErrorMessage("Address must not be empty, please fill it");
            setErrorForm(true);
            setOpen(true);

            return;
        } else if(ssn.trim().length <= 0) {
            setErrorMessage("SSN must not be empty, please fill it");
            setErrorForm(true);
            setOpen(true);

            return;
        }

        const duplicateSsn = members.find(v => v.ssn === ssn);

        if(duplicateSsn){
            setErrorMessage("SSN must be unique, please re-enter it");
            setOpen(true);

            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
        };

        const memberData = {
            "firstName": firstName,
            "lastName": lastName,
            "address": address,
            "ssn": ssn
        };

        const res = await axios.post(`${membersApiUrl}/api/members`, JSON.stringify(memberData), config);

        if(res.status === 200) {
            setMembers(members => [...members, memberData]);
            resetForm();
            setOpenSuccess(true);
        }
    }

    const getToken = async () => {
        const authRes = await axios.post(`${membersApiUrl}/auth`, authBody);

        if(authRes.data){
            setToken(authRes.data.token);
            getMembers(authRes.data.token);
        }
    }

    const getMembers = async (_token) => {
        const config = {
            headers: { Authorization: `Bearer ${_token}` }
        };

        const res = await axios.get(`${membersApiUrl}/api/members`, config);

        if(res.data){
            setMembers(res.data);
        }
    }

    const changeFirstName = (e) => {
        setFirstName(e.target.value);
    }

    const changeLastName = (e) => {
        setLastName(e.target.value);
    }

    const changeAddress = (e) => {
        setAddress(e.target.value);
    }

    const changeSsn = (e) => {
        setSsn(e.target.value);
    }

    const restartAutoReset = () => {
        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            getToken();
        }, 1000 * 120);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
        setOpenSuccess(false);
    };

    const onMouseMove = () => {
        restartAutoReset();
    };

    useEffect(() => {
        getToken();

        window.addEventListener('mousemove', onMouseMove);

        // initiate timeout
        restartAutoReset();
    }, []);

    return(
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <div style={{ textAlign: "center" }}>
                        <h1>Form</h1>
                    </div>

                    <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" style={{ textAlign: "center" }}>
                        <div>
                            <TextField
                                id="firstName"
                                label="First Name"
                                error ={errorForm & firstName.length === 0 ? true : false }
                                onChange={changeFirstName}
                                value={firstName}
                            />  

                            <TextField
                                id="lastName"
                                label="Last Name"
                                error ={errorForm & lastName.length === 0 ? true : false }
                                onChange={changeLastName}
                                value={lastName}
                            /> 

                            <TextField
                                id="address"
                                label="Address"
                                error ={errorForm & address.length === 0 ? true : false }
                                onChange={changeAddress}
                                value={address}
                            /> 
                            
                            <InputMask mask="999-99-9999" maskChar=" " value={ssn} disabled={false} label="SSN" error ={errorForm & ssn.length === 0 ? true : false } onChange={changeSsn} >
                                {(inputProps) => <TextField  {...inputProps} type="tel"  />}
                            </InputMask>

                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Button variant="contained" onClick={resetForm}>Reset</Button>
                                </Grid>

                                <Grid item xs={6}>
                                    <Button variant="contained" onClick={saveMember}>Save</Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Box>
                </Grid>
                <Grid item xs={8}>
                    <div style={{ textAlign: "center" }}>
                        <h1>Members List</h1>
                    </div>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>First Name</TableCell>
                                    <TableCell >Last Name</TableCell>
                                    <TableCell >Address</TableCell>
                                    <TableCell >SSN</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {members.map((row) => (
                                <TableRow
                                key={row.ssn}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell>{row.firstName}</TableCell>
                                <TableCell >{row.lastName}</TableCell>
                                <TableCell >{row.address}</TableCell>
                                <TableCell >{row.ssn}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={openSuccess} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Member added successfully
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default UserManagement;