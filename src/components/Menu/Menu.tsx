import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { AccountCircle } from '@material-ui/icons'
import MenuDrawer from '../MenuDrawer/MenuDrawer'
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}))

export default function NavigationMenu(props: { id?: string }) {
    const classes = useStyles()

    const [drawerState, setState] = React.useState(false);

    const closeDrawer = () => (
      event: React.KeyboardEvent | React.MouseEvent,
    ) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
  
      setState(false);
    };

    const openDrawer = () => {
      setState(true);
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar id={props.id}>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        onClick={openDrawer}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Tomas Valiūnas
                    </Typography>
                    <IconButton component={Link} to="/about" color="inherit">
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <MenuDrawer closeDrawer={closeDrawer} open={drawerState}></MenuDrawer>
        </div>
    )
}
