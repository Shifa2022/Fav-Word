import  React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState,useEffect } from 'react';
import './App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { Button } from '@mui/material';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function InteractiveList() {

  const [wordlist,setWordlist]=useState([])
  let [wordId, setWordId] = useState(0)
  let [optionwords, setoptionwords] = useState([])
  const [id, setId] = useState(0)
  useEffect(() => {
    const getData = async () => {
      try{
        const res= await fetch('http://127.0.0.1:5000/subscribe');
        console.log(res)
        const data=await res.json();
      console.log(data.subscriptionfavword)
      setWordlist(data.subscriptionfavword)
      
      }catch(error){
      console.log(error) 
      }
    }
    getData()
  }, [wordId,optionwords]);
  
 
  
  let deletebutton= async (event)=>{
    // setId(event.target.value)
    console.log(event.target)
    console.log(event.target.value)
    // alert("u clicked")
    wordId=event.target.value
    console.log(wordId)
    setWordId(event.target.value)
    localStorage.setItem('word_id',event.target.value)
  //   if(localStorage.getItem("word_id"))
  //   {
  //   <CircularProgress sx={{ display: 'flex' }}/>
  // }
  // else{
  //   localStorage.removeItem("word_id")
  // }
    try{
      const result= await fetch('http://127.0.0.1:5000/unsubscribe/'+wordId,
      {
    method: 'DELETE',
     header: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
       }
      }
      );
      console.log(result)
      // localStorage.removeItem("word_id")
    }catch(error){
      console.log(error) 
    }
   
  }

  

   optionwords = wordlist.map((word) =>
  
   <TableContainer component={Paper}>
   <Table sx={{ minWidth: 700 }} aria-label="customized table">
     
       <TableBody>
                <StyledTableRow  className="containerwords" value={word.id} 
                // onClick={console.log(word.id)}
                >
                  {word.word}
                  <>
               <card className='DELBUTTON' sx={{ flexGrow: 2, maxWidth: 3000 }}>
                 
               <Button className="positiondelbutton" 
                  edge="end" 
                  aria-label="delete" 
                  value={word.id} 
                  onClick={(event) => deletebutton(event)}
                 >
                         
                      {/* <DeleteIcon/>  */}
                        unsubscribe
                      </Button>
                     
                      </card>
                    </>  
                  </StyledTableRow>
                  </TableBody>
      </Table>
    </TableContainer>
                
                 
            );
  return (
   <><div>
   
    </div><Box sx={{ flexGrow: 3, maxWidth: 3000 }}>

        <Grid item xs={12} md={6}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div" className="div">
           List of registered Favorite word
          </Typography>
          <Demo>
            <List>

              <ListItem
              >
               
                <ListItemText className='subscribe'
                  // primary="Single-line item"
                  primary={optionwords}
                   />
          


              </ListItem>

            </List>
          </Demo>
        </Grid>
                  
{/* {localStorage.getItem("word_id")?<CircularProgress sx={{ display: 'flex' }}/>:null} */}
        
      </Box></>
  );

  
};

