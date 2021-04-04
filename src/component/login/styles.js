export default {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    minHeight: '100%',
    padding: '20px',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  frameContent: {
    WebkitBorderRadius: '10px 10px 10px 10px',
    borderRadius: '10px 10px 10px 10px',
    background: '#fff',
    padding: '0px',
    width: '90%',
    maxWidth: '450px',
    position: 'fixed',
    WebkitBoxShadow: '0 30px 60px 0 rgba(0,0,0,0.3)',
    boxShadow: '0 30px 60px 0 rgba(0,0,0,0.3)',
    textAlign: 'center',
    border: '5px solid #2196f3',
    top: '25%'
  },
  logIn: {
    width: '75px',
    height: '75px',
    backgroundSize: '100%',
    margin: '15px auto',
    borderRadius: '50px',
    backgroundColor: 'rgb(0 127 185 / 50%)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: 'aliceblue',
    cursor: 'pointer',
    ':hover':{
      backgroundColor: 'rgb(0 127 185 / 25%)',
    }
  },
  register: {
    width: '75px',
    height: '75px',
    backgroundSize: '100%',
    margin: '15px auto',
    borderRadius: '50px',
    backgroundColor: 'rgb(232 88 78)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: 'aliceblue',
    cursor: 'pointer',
    ':hover':{
      backgroundColor: 'rgb(232 88 78 / 25%)',
    }
  },
  logo: {
    width: '75px',
    height: '75px',
    backgroundSize: '100%',
    margin: '15px auto'
  },
  inputContent:{
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '5px',
    width: '93%',
    padding: '10px 20px'
  },
  input:{
    backgroundColor: '#f6f6f6',
    color: '#0d0d0d',
    padding: '10px 32px',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '5px',
    width: '90%',
    border: '2px solid #f6f6f6',
  },
  submit:{
    backgroundColor: '#000000',
    border: 'none',
    color: 'white',
    padding: '15px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    textTransform: 'uppercase',
    fontSize: '13px',
    opacity: 0.5,
    margin: '20px',
    width: '50%',
    ':hover':{
      opacity: 1,
      backgroundColor: '#000000',
      boxShadow: '#00000'
    }
  },
  back:{
    backgroundColor: '#ff990e',
    border: 'none',
    color: 'white',
    padding: '15px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    textTransform: 'uppercase',
    fontSize: '13px',
    opacity: 0.5,
    margin: '20px',
    width: '50%',
    ':hover':{
      opacity: 1,
      backgroundColor: '#ff990e',
      boxShadow: '#00000'
    }
  },
  forgetPWD:{
    marginBottom: '20px'
  }
}