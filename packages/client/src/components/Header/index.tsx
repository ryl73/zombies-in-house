import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Button,
  makeStyles,
  createStyles,
  Theme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { useState } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: theme.spacing(0, 2),
    },
    navContainer: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'center',
      width: '100%',
    },
    link: {
      textDecoration: 'none',
      color: 'inherit',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(1, 2),
      transition: 'all .2s ease',
    },
    menuButton: {
      marginRight: theme.spacing(2),
      position: 'absolute',
      left: theme.spacing(2),
      transition: 'all .2s ease',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    drawer: {
      '& .MuiDrawer-paper': {
        backgroundColor: '#1D333B',
        color: '#F7F4F3',
        width: 250,
      },
    },
    drawerItem: {
      '&:hover': {
        backgroundColor: '#355155',
      },
    },

    button: {
      margin: theme.spacing(0, 0.5),
      transition: 'all .2s ease',
      '&:hover': {
        backgroundColor: '#355155 !important',
        '& $link': {
          color: '#CBAC51 !important',
        },
      },
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    desktopMenu: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  })
)

export const Header = () => {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open)
  }

  const menuItems = [
    { text: 'Главная', to: '/' },
    { text: 'Вход', to: '/signin' },
    { text: 'Регистрация', to: '/signup' },
    { text: 'Профиль', to: '/profile' },
    { text: 'Игра', to: '/game' },
    { text: 'Лидерборд', to: '/leaderboard' },
    { text: 'Форум', to: '/forum' },
    { text: 'Топик форума', to: '/forum/topic' },
    { text: '404', to: '/404' },
  ]

  return (
    <AppBar position="sticky">
      <Toolbar className={classes.toolbar} variant="dense">
        {isMobile && (
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        )}

        <div className={classes.navContainer}>
          {/* Десктопное меню */}
          <div className={classes.desktopMenu}>
            {menuItems.map(item => (
              <Button key={item.to} className={classes.button}>
                <Link to={item.to} className={classes.link}>
                  {item.text}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </Toolbar>

      {/* Мобильное меню */}
      <Drawer
        className={classes.drawer}
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}>
        <List>
          {menuItems.map(item => (
            <ListItem
              button
              key={item.to}
              className={classes.drawerItem}
              component={Link}
              to={item.to}
              onClick={toggleDrawer(false)}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  )
}
