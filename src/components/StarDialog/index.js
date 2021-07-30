import React, { Component } from "react";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@material-ui/core";
import ListIcon from "@material-ui/icons/List";
import AddIcon from "@material-ui/icons/Add";
import { theme } from "../../components";

export default class StarDialog extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.state, isCreateOpen: false };
    this.handleCreateClose = this.handleCreateClose.bind(this);
    this.handleCreateChange = this.handleCreateChange.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  handleCreateClose(evt) {
    this.setState({ isCreateOpen: false });
  }

  handleCreateChange(evt) {
    this.setState({ createValue: evt.target.value });
  }

  handleCreateSubmit() {
    let { createValue } = this.state;
    let starred_list = JSON.parse(localStorage.getItem("starred_list") || "[]");
    let n = starred_list.findIndex((i) => i.name == createValue);

    if (n == -1) {
      let metadata = { name: createValue, children: [] };
      starred_list.push(metadata);
      localStorage.setItem("starred_list", JSON.stringify(starred_list));
      this.setState({ isCreateOpen: false, starred_list: starred_list });
    } else {
      this.setState({ isCreateOpen: false });
    }
  }

  handleListItemClick(s, n) {
    if (s == "createStarredList" && n == -1) {
      this.setState({ isCreateOpen: true });
    } else {
      let { metadata } = this.props;
      let starred_list = JSON.parse(
        localStorage.getItem("starred_list") || "[]"
      );
      let i = starred_list[n].children.findIndex((i) => i.id == metadata.id);
      if (i == -1) {
        starred_list[n].children.unshift(metadata);
        localStorage.setItem("starred_list", JSON.stringify(starred_list));
        this.props.handleClose("unstarred");
        this.setState({ starred_list: starred_list });
      } else {
        starred_list[n].children.splice(i, 1);
        localStorage.setItem("starred_list", JSON.stringify(starred_list));
        this.props.handleClose();
      }
    }
  }

  render() {
    let { isOpen, metadata } = this.props;
    let { isCreateOpen } = this.state;
    console.log(metadata.id);
    let starred_list = JSON.parse(localStorage.getItem("starred_list") || "[]");

    return (
      <div>
        <Dialog
          onClose={this.props.handleClose}
          aria-labelledby="simple-dialog-title"
          open={isOpen}
        >
          <DialogTitle id="simple-dialog-title">
            Select starred list
          </DialogTitle>
          <List>
            {starred_list && starred_list.length
              ? starred_list.map((s, n) => (
                  <ListItem
                    button
                    onClick={() => this.handleListItemClick(s, n)}
                    key={s.name}
                  >
                    <ListItemAvatar>
                      <Avatar
                        style={
                          s.children.some((x) => x.id == metadata.id)
                            ? { backgroundColor: theme.palette.success.main }
                            : null
                        }
                      >
                        <ListIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={s.name} />
                  </ListItem>
                ))
              : null}

            <br />
            <ListItem
              autoFocus
              button
              onClick={() => this.handleListItemClick("createStarredList", -1)}
            >
              <ListItemAvatar>
                <Avatar>
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Create starred list" />
            </ListItem>
          </List>
        </Dialog>
        <Dialog
          open={isCreateOpen}
          onClose={this.handleCreateClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create starred list</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the starred list's name in the form below.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              onChange={this.handleCreateChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCreateClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleCreateSubmit} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
