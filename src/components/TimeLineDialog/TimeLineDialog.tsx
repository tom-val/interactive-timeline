import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import './TimeLineDialog.css';
import { Grow, } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography className="title" variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    fontFamily: "Montserrat"
  },
}))(MuiDialogContent);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Grow ref={ref} {...props} />;
});

interface TimeLineDialogProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}


function TimeLineDialog(props: TimeLineDialogProps) {
  
  return (
    <Dialog TransitionComponent={Transition} onClose={props.onClose} aria-labelledby="customized-dialog-title" open={props.open}>

    <DialogTitle id="customized-dialog-title" onClose={props.onClose}>
        {props.title}
    </DialogTitle>

    <DialogContent dividers>
      <>{props.children}</>
    </DialogContent>
    <div className="bottom"></div>
  </Dialog>
  );
}

export default TimeLineDialog;
