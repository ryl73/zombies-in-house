import React from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import { Edit, Delete } from '@material-ui/icons'

interface TopicMenuProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export const TopicMenu: React.FC<TopicMenuProps> = ({
  anchorEl,
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
      <MenuItem onClick={onDelete}>
        <Delete fontSize="small" style={{ marginRight: 8 }} />
        Удалить
      </MenuItem>
    </Menu>
  )
}
