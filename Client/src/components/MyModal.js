import { Button, Container, Grid, Modal, TextField } from "@material-ui/core";
import React from "react";
import ReactJson from "react-json-view";

function MyModal(props) {
  const { modalOpen, setModalOpen, entityName, setEntityName, handleClick, error, errorMessage } = props;
  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(!modalOpen);
        }}
      >
        <Container style={{ backgroundColor: "lightGrey" }} justifyContent="center" alignItems="center">
          <Container style={{ padding: "5vh", backgroundColor: "white", alignSelf: "center" }}>
            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
              <Grid items>
                <TextField
                  variant="filled"
                  label="Group Name..."
                  fullWidth
                  name="group"
                  value={entityName}
                  onChange={(e) => {
                    setEntityName(e.target.value);
                  }}
                />
              </Grid>
              <Grid items>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={async () => {
                    await handleClick();
                  }}
                >
                  Join Chat
                </Button>
              </Grid>
            </Grid>
            {error ? <ReactJson src={errorMessage} /> : ""}
          </Container>
        </Container>
      </Modal>
    </>
  );
}

export default MyModal;
