import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from '@material-ui/core'
import DOMPurify from 'dompurify'

interface EditCommentDialogProps {
  open: boolean
  message: string
  isEditing: boolean
  onClose: () => void
  onSave: () => void
  onMessageChange: (message: string) => void
}

export const EditCommentDialog: React.FC<EditCommentDialogProps> = ({
  open,
  message,
  isEditing,
  onClose,
  onSave,
  onMessageChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Редактировать комментарий</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Комментарий"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={DOMPurify.sanitize(message)}
          onChange={e => onMessageChange(e.target.value)}
          disabled={isEditing}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isEditing}>
          Отмена
        </Button>
        <Button
          onClick={onSave}
          color="primary"
          variant="contained"
          disabled={isEditing || !DOMPurify.sanitize(message).trim()}>
          {isEditing ? <CircularProgress size={24} /> : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
