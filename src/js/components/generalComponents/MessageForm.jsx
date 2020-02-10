import React from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";

class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.open = false;
    this.state = {
      open: false
    };
  }

  openDialog() {
    this.props.openDialog();
    this.setState({ open: true });
  }

  closeDialog() {
    this.props.closeDialog();
    this.setState({ open: this.props.open });
  }

  static get componentDidMount() {
    this.setState({ open: this.props.open });
  }

//   //сюда передается фалс изначально поэтмоу он не отображается
//   //позже когда сюда передается пропс = тру тут должен меняться либо стейт либо пропс из родителя
//   //Get state from store and update component state
//   static getDerivedStateFromProps(props, state) {
//     if (state.open !== props.open && state.open !== true) {
//       return {
//         open: props.open
//       };
//     }
    
//     return null;
//   }

  render() {
    const { open } = this.props;
    this.open = open;

    return (
      <div className="Apptest">
        {/* <Button onClick={this.openDialog.bind(this)}>Open dialog</Button> */}
        <Dialog open={this.open} onEnter={console.log("Hey.")}>
          <DialogTitle>{this.props.headermessage}</DialogTitle>
          <DialogContent>
            {this.props.message}
            <Grid>
              <Button onClick={this.closeDialog.bind(this)}>ОК</Button>
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default MessageForm;
