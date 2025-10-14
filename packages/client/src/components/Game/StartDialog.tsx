import { ChangeEvent, FC, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  makeStyles,
  Slider,
  TextField,
  Typography,
} from '@material-ui/core'
import { KeyboardArrowLeft } from '@material-ui/icons'
import { Link } from 'react-router-dom'
import { GameType, setLocalNumberOfPlayers } from '../../slices/gameSlice'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'

type Props = {
  isDialog: boolean
  startGame: (type: GameType, roomId?: string) => void
}

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiButton-root': {
      margin: '0',
    },
  },
}))

export const StartDialog: FC<Props> = ({ isDialog, startGame }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()

  const { localNumberOfPlayers } = useAppSelector(state => state.game)

  const handleSliderChange = (
    e: ChangeEvent<unknown>,
    newValue: number | number[]
  ) => {
    dispatch(setLocalNumberOfPlayers(newValue as number))
  }

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
          <div>
            <Typography variant="h6" align="center">
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
                onClick={() => startGame('online')}>
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
                  onClick={() => startGame('local', roomIdInput)}>
                  Подключиться к комнате
                </Button>
              </Box>
            </Box>
          </div>
          <Divider orientation="vertical" flexItem />
          <div className="">
            <Typography variant="h6" align="center">
              Играть локально
            </Typography>
            <Box marginTop="32px">
              <Slider
                value={localNumberOfPlayers}
                defaultValue={2}
                step={1}
                min={2}
                max={5}
                valueLabelDisplay="auto"
                onChange={handleSliderChange}
              />
              <Typography variant="h6">
                Кол-во игроков: {localNumberOfPlayers}
              </Typography>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              gridGap="24px"
              marginTop="16px">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => startGame('local')}>
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
