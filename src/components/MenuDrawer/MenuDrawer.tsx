import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import PersonIcon from '@material-ui/icons/Person'
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    title: {
        color: 'rgba(233,33,99,1)',
        fontWeight: 600,
        textAlign: 'center',
    },
})

export interface DrawerProps {
    open: boolean
    closeDrawer: () => (event: React.KeyboardEvent | React.MouseEvent) => void
}

export default function MenuDrawer(props: DrawerProps) {
    const classes = useStyles()

    return (
        <Drawer anchor="left" open={props.open} onClose={props.closeDrawer()}>
            <div
                className={classes.list}
                role="presentation"
                onClick={props.closeDrawer()}
                onKeyDown={props.closeDrawer()}
            >
                <Typography className={classes.title} variant="h6">
                    Navigation
                </Typography>
                <List>
                    <ListItem button component={Link} to="/" onClick={props.closeDrawer()}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItem>
                    <ListItem button component="a" href="https://quiz.valiunas.dev">
                        <ListItemIcon>
                            <HelpOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary="Quiz App" />
                    </ListItem>
                    <ListItem button component="a" href="https://www.linkedin.com/in/tomas-valiunas-5a5a85114/">
                        <ListItemIcon>
                            <LinkedInIcon />
                        </ListItemIcon>
                        <ListItemText primary="LinkedIn" />
                    </ListItem>
                    <ListItem button component="a" href="https://github.com/tom-val">
                        <ListItemIcon>
                            <GitHubIcon />
                        </ListItemIcon>
                        <ListItemText primary="Github" />
                    </ListItem>
                    <ListItem button component={Link} to="/about" onClick={props.closeDrawer()}>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="About" />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    )
}
