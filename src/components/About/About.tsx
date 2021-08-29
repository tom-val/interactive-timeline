import {
    Avatar,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    createStyles,
    IconButton,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core'
import {useHistory} from 'react-router-dom';
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import GitHubIcon from '@material-ui/icons/GitHub'
import React from 'react'

import './About.css'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            paddingTop: '5rem',
        },
        media: {
            height: 340,
        },
        root: {
            maxWidth: 345,
        },
    })
)

export default function About() {
    const classes = useStyles()
    const history = useHistory();
    const handleOnClick = () => history.push('/');

    return (
        <Container className={classes.container}>
            <Card className={classes.root}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image="/tomas-valiunas.jpg"
                        title="Tomas"
                        onClick={handleOnClick}
                    />
                    <CardContent onClick={handleOnClick}>
                        <Typography variant="h5" component="h2">
                            Tomas Valiūnas
                        </Typography>
                        <Typography
                            gutterBottom
                            variant="subtitle1"
                            component="h2"
                        >
                            Software Developer
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                            gutterBottom
                        >
                            I am very positive person who tries to enjoy every day oh his life.
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            Technologies: .NET, Microsoft SQL, Angular and React
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                        >
                            tomovaliuno@gmail.com
                        </Typography>

                        <IconButton aria-label="LinkedIn" component="a" href="https://www.linkedin.com/in/tomas-valiunas-5a5a85114/" >
                            <LinkedInIcon />
                        </IconButton>
                        <IconButton aria-label="Github" component="a" href="https://github.com/tom-val">
                            <GitHubIcon />
                        </IconButton>
                    </CardActions>
                </CardActionArea>
            </Card>
        </Container>
    )
}
