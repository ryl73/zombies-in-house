import { FC } from 'react'
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { useAppSelector } from '../../hooks/useApp'

type Props = {
  isDialog: boolean
  startGame: () => void
}

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiButton-root': {
      margin: '0',
    },
  },
}))

export const LobbyDialog: FC<Props> = ({ isDialog, startGame }) => {
  const classes = useStyles()
  const { users, room } = useAppSelector(state => state.game)
  const { data } = useAppSelector(state => state.user)

  return (
    <Dialog open={isDialog} maxWidth="md">
      <DialogContent classes={{ root: classes.root }}>
        <Box marginBottom="20px" minWidth="300px">
          <Typography variant="h3">Игроки</Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          gridGap="16px"
          marginBottom="20px">
          {users.map(user => (
            <Box
              key={user.id}
              display="flex"
              alignItems="center"
              gridGap="8px"
              padding="8px"
              bgcolor="primary.light"
              borderRadius="16px">
              <Avatar />
              <Typography variant="h6">{user.login}</Typography>
            </Box>
          ))}
        </Box>
        {room?.hostId === data?.id && users.length >= 2 && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={startGame}>
            Начать игру
          </Button>
        )}
      </DialogContent>
      <DialogActions />
    </Dialog>
  )
}
