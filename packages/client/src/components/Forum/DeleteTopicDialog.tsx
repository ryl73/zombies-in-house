import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core'

interface DeleteTopicDialogProps {
  open: boolean
  topicTitle: string
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteTopicDialog: React.FC<DeleteTopicDialogProps> = ({
  open,
  topicTitle,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Удаление топика</DialogTitle>
      <DialogContent>
        <Typography>
          Вы уверены, что хотите удалить топик "{topicTitle}"? Это действие
          нельзя отменить.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          color="secondary"
          variant="contained"
          disabled={isDeleting}>
          {isDeleting ? <CircularProgress size={24} /> : 'Удалить'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
