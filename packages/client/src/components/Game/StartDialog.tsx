import { FC, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import { KeyboardArrowLeft } from '@material-ui/icons'
import { Link } from 'react-router-dom'

type Props = {
  isDialog: boolean
  startGame: (isLocal: boolean, roomId?: string) => void
}

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiOutlinedInput-root': {
      width: '100%',
    },
    '& .MuiButton-root': {
      margin: '0',
    },
  },
}))

export const StartDialog: FC<Props> = ({ isDialog, startGame }) => {
  const classes = useStyles()

  const [roomIdInput, setRoomIdInput] = useState('')

  return (
    <Dialog open={isDialog} maxWidth="md">
      <DialogContent classes={{ root: classes.root }}>
        <Box marginBottom="16px">
          <Button
            component={Link}
            to="/"
            variant="text"
            color="primary"
            size="medium"
            startIcon={<KeyboardArrowLeft />}>
            Назад
          </Button>
        </Box>

        <Box display="grid" gridTemplateColumns="1fr 1px 1fr" gridGap="24px">
          <div className="">
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              Играть по сети
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              gridGap="24px"
              marginTop="16px">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => startGame(false)}>
                Создать комнату
              </Button>
              <Box display="flex" flexDirection="column" gridGap="12px">
                <TextField
                  placeholder="Введите id комнаты"
                  variant="outlined"
                  size="small"
                  onChange={e => setRoomIdInput(e.target.value)}
                  value={roomIdInput}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!roomIdInput}
                  onClick={() => startGame(true, roomIdInput)}>
                  Подключиться к комнате
                </Button>
              </Box>
            </Box>
          </div>
          <Divider orientation="vertical" flexItem />
          <div className="">
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              Играть локально
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              gridGap="24px"
              marginTop="16px">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => startGame(true)}>
                Начать игру
              </Button>
            </Box>
          </div>
        </Box>
      </DialogContent>
      <DialogActions />
    </Dialog>
  )
}
