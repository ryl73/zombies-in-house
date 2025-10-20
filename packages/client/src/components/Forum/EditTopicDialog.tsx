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

interface EditTopicDialogProps {
  open: boolean
  title: string
  description: string
  isEditing: boolean
  onClose: () => void
  onSave: () => void
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
}

export const EditTopicDialog: React.FC<EditTopicDialogProps> = ({
  open,
  title,
  description,
  isEditing,
  onClose,
  onSave,
  onTitleChange,
  onDescriptionChange,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Редактировать топик</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Заголовок"
          fullWidth
          variant="outlined"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          disabled={isEditing}
        />
        <TextField
          margin="dense"
          label="Описание"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={e => onDescriptionChange(e.target.value)}
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
          disabled={isEditing || !title.trim() || !description.trim()}>
          {isEditing ? <CircularProgress size={24} /> : 'Сохранить'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
