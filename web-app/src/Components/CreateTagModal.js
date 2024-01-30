import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from "react";
import { toast } from "react-toastify";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CreateTagModal({fetchTags, apiErrorToast}){
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("#cccccc");

    async function createTag(){
        if(newTagName!=""){
            try{
                const response = await fetch("/tags", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "name": newTagName,
                        "color": newTagColor,
                    })
                });
                handleClose();
                fetchTags();
                toast.success('Libellé créé.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
            catch(e){
                console.error("Erreur à la création d'un libellé - "+e);
                apiErrorToast();
            }
        }
    }

    return(
        <div>
            <Button className='Button-Etiquettes' onClick={handleOpen}>
                Ajouter un libellé
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant='h6' component="h2">
                        Ajout d'un libellé
                    </Typography>
                    <form onSubmit={(event) => {event.preventDefault(); createTag();}}>
                        <input type='text' placeholder='Nom' value={newTagName} onChange={(event) => {setNewTagName(event.target.value);}}/>
                        <input type='color' value={newTagColor} onChange={(event) => {setNewTagColor(event.target.value);}}/>
                        <button className='Button-Etiquettes' onClick={(event) => {event.preventDefault(); createTag();} }>+</button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}