import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    }
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);    
  }

  componentDidMount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.hasOwnProperty('onRef') && this.props.onRef(undefined);
  }
  
  open(){
    if(this.modalRef){
      this.setState({isOpen: true});
    }
  }

  close(){
    if(this.modalRef){
      this.setState({isOpen: false});
    }
  }

  render() {
    
    const { title, children, buttonAction, hideButtonClose } = this.props;
    return (

      <div className="modal" ref={modal => this.modalRef = modal}>
        <Dialog
          open={this.state.isOpen}
          onClose={this.close}
          aria-describedby="responsive-dialog-description"
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {children}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            { buttonAction }
            {
              !hideButtonClose && 
              <Button onClick={() => this.close()} color="primary">
                Close
              </Button>
            }
          </DialogActions>
        </Dialog>

      </div>
    );
  }
}

Modal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onRef: PropTypes.func,
  onClose: PropTypes.func,
  hideButtonClose: PropTypes.bool,
  buttonAction: PropTypes.any
};

export default Modal;
