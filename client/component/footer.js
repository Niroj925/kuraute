import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


const useStyles = makeStyles((theme) => ({
  footer: {
    padding: 10,
    marginTop: 'auto',
    backgroundColor:'grey[200]',
  },
  footerBox:{
    width:'100%',
    // backgroundColor:'#F5F5ED',
    marginTop: 10,
  }
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <Container className={classes.footerBox}>
       <footer className={classes.footer}>
      <Container maxWidth="sm">
         <Copyright />
         
      </Container>
    </footer>
    </Container>
   
  );
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      {new Date().getFullYear()}
      {',All the rights are reserved by NeoTech.'}
    </Typography>
  );
}