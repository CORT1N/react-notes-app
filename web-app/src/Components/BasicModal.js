import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({isDarkMode, notes, tags, note, apiErrorToast, saveNote}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

    async function updateTag(note, tagID){
        try{
            if(note.tags.find(tagInList => tagInList === tagID)){
                const index = note.tags.indexOf(tagID);
                note.tags.splice(index, 1);
            }else{
                note.tags.push(tagID);
            }
            await saveNote();
        }catch(e){
            console.error("Erreur à la modification du libellé - "+e);
            apiErrorToast();
        }
    }

  return (
    <div>
      <Button className='Button-Etiquettes' onClick={handleOpen}>
        <img 
            src={isDarkMode ? "/images/etiquette_white.png" : "/images/etiquette.png"}
        />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Libellés
          </Typography>
          {tags.map(tag => (
            <div className='tagListItem'>
                <input
                    type='checkbox'
                    checked={note.tags.find(tagInList => tagInList === tag.id) ? true : false}
                    name={tag.name}
                    onChange={() => updateTag(note, tag.id)}
                />
                <span
                    key={tag.id}
                    className='Etiquette'
                    style={{backgroundColor: tag.color}}
                >
                    {tag.name}
                </span>
            </div> 
          ))}
        </Box>
      </Modal>
    </div>
  );
}