import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';

import {useRouter} from 'next/router'

const useStyles = makeStyles((theme) => ({
  root: {
    padding:"5px",
    margin:"10px"
  },
  hero: {
    height: '100vh',
    backgroundImage: 'url(https://picsum.photos/id/237/1600/900)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    marginBottom:"10px",
  },
  main: {
    marginBottom: "10px",
  },
  card: {
    display: 'flex',
    margin: "10px",
    '&:hover': {
      boxShadow: "10px",
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardMedia: {
    minWidth: '200px',
    minHeight: '200px',
    flexShrink: 0,
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const router=useRouter();
  return (
    <div className={classes.root}>
      <div className={classes.hero}>
        <Typography variant="h1" align="center">
          Welcome to Kuraute
        </Typography>
      </div>

      <Container maxWidth="md" className={classes.main}>
        <Grid container spacing={4} justify="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom>
              What is Kuraute?
            </Typography>
            <Typography variant="body1" paragraph>
              Kuraute is a real-time chat web application that allows you to communicate with your friends, family, or colleagues. It's fast, easy to use, and completely free.
            </Typography>
            <Typography variant="body1" paragraph>
              With Kuraute, you can create groups, invite people, and start chatting instantly. You can also send photos, videos, and documents to your contacts.
            </Typography>
            <Button variant="contained" color="primary" onClick={()=>router.push('/signup')}>
              Sign Up Now
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image="https://picsum.photos/id/1053/200/200"
                title="Chat on Kuraute"
              />
              <CardContent className={classes.cardContent}>
                <Typography variant="h5">
                  Chat on Kuraute
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Join the conversation with your friends and family
                </Typography>
                <Button variant="outlined" color="primary"  onClick={()=>router.push('/login')}>
                  Sign In
                </Button>
              </CardContent>
            </Card>
            {/* <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image="https://picsum.photos/id/1061/200/200"
                title="Create a Group"
              />
              <CardContent className={classes.cardContent}>
                <Typography variant="h5">
                  Create a Group
                </Typography>

                </CardContent>
                </Card> */}
                </Grid>
               </Grid>
               </Container>
               </div>
                )
                }
export default HomePage;