import React from 'react'
import { Menu, MenuItem, CircularProgress } from '@material-ui/core'
import { Edit, Delete } from '@material-ui/icons'

interface CommentMenuProps {
  anchorEl: HTMLElement | null
  isDeleting: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export const CommentMenu: React.FC<CommentMenuProps> = ({
  anchorEl,
  isDeleting,
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
      <MenuItem onClick={onEdit}>
        <Edit fontSize="small" style={{ marginRight: 8 }} />
        Редактировать
      </MenuItem>
      <MenuItem onClick={onDelete} disabled={isDeleting}>
        {isDeleting ? (
          <CircularProgress size={16} style={{ marginRight: 8 }} />
        ) : (
          <Delete fontSize="small" style={{ marginRight: 8 }} />
        )}
        Удалить
      </MenuItem>
    </Menu>
  )
}
