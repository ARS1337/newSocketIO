import React, { useState, useContext } from "react";
import { Box, Button, Container, FormControlLabel, Grid, Paper, Radio, RadioGroup, TextField } from "@material-ui/core";
import request from "../utils/utils";
import ReactJson from "react-json-view";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../utils/Socket";

function First(props) {
  const Context = useContext(SocketContext);
  const setUserName = Context.setUserName;
  const userName = Context.userName;
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [method, setMethod] = useState("login");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    request("/socket", "POST", { name: userName, pwd: pwd, process: method })
      .then(async (res) => {
        if (res.status !== 200) {
          setError(true);
        } else {
          sessionStorage.setItem("userName", userName);
          setUserName(userName);
          history.push("/socket");
        }
        return res;
      })
      .then((r) => r.json())
      .then((r) => {
        setErrorMessage(r.errors);
        setError(true);
      });
  };

  return (
    <Container
      xs={12}
      md={6}
      lg={4}
      style={{
        height: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItem: "flex-start",
      }}
    >
      {error ? (
        <ReactJson src={errorMessage} />
      ) : (
        <>
          <Paper
            variant="elevation"
            elevation={24}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItem: "center",
              alignSelf: "center",
              paddingTop: "30px",
              paddingBottom: "25px",
            }}
          >
            <Container
              style={{
                display: "flex",
                justifyContent: "center",
                alignItem: "center",
              }}
            >
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      variant="outlined"
                      placeholder="Name"
                      value={userName}
                      name="name"
                      onChange={(e) => {
                        setUserName(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="password"
                      variant="outlined"
                      placeholder="Password"
                      style={{ paddingTop: "1vh" }}
                      name="pwd"
                      value={pwd}
                      onChange={(e) => {
                        setPwd(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item>
                  <Box style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <RadioGroup
                      name="process"
                      value={method}
                      onChange={(e) => {
                        setMethod(e.target.value);
                        console.log(e.target.value);
                      }}
                      style={{ paddingTop: "1vh" }}
                      row
                    >
                      <FormControlLabel name="login" value="login" control={<Radio />} label="Login" />
                      <FormControlLabel name="signup" value="signup" control={<Radio />} label="SignUp" />
                    </RadioGroup>
                    </Box>
                  </Grid>
                  <Grid item style={{ paddingTop: "1vh" }}>
                    <Box style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                      <Button type="submit" variant="contained">
                        Submit
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Container>
          </Paper>
        </>
      )}
    </Container>
  );
}

export default First;
