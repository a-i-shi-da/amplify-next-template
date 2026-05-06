import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type Props = {
  open:boolean,
  title:string,
  text:string,
  handleCancel:()=>void,
  handleConfirm:()=>void,
}

export default function ConFirmDialog({open,title,text,handleCancel,handleConfirm}:Props) {
  
    return (
    <>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        role="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} autoFocus>
            キャンセル
          </Button>
          <Button onClick={handleConfirm}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}