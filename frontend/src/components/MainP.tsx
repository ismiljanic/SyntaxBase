import '../styles/MainP.css'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import { NavigateNext } from '@mui/icons-material'
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';

type Props = {}

const MainP = (props: Props) => {
  return (
    <div className='container'>
        <div className='header'>
              <div className = "item">&nbsp; &nbsp;
                Please <Link to="/login"><Button className = "btn" variant='outlined' sx={{color: 'black', borderColor: 'transparent', bgcolor: '', '&:hover': {bgcolor: 'red', color: 'white'}}}><b>LOGIN</b></Button></Link>
                or <Link to="/register"><Button className = "btn" variant='outlined' sx={{color: 'black', borderColor: 'transparent', bgcolor: '', '&:hover': {bgcolor: 'red', color: 'white'}}}><b>REGISTER</b></Button></Link>
              </div>
              <div className='cont' title='Contact Us'><EmailIcon sx={{ml: '30px'}}/>&nbsp;mili@vili.hr&nbsp;&nbsp;&nbsp;&nbsp;<CallIcon/>&nbsp;+385 (0)1 2345 678</div>
        </div> *
    </div>
  )
}

export default MainP