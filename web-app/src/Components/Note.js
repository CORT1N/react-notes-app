import { useParams, useNavigate } from "react-router-dom";
import './Note.css';
import SaveLoader from "./SaveLoader";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import Swal from 'sweetalert2'
import { toast } from "react-toastify";

function Note({notes, fetchNotes, apiErrorToast }){
    const { id } = useParams();
    const [note, setNote] = useState(notes.find(note => note.id === parseInt(id)));
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [idSaved, setIdSaved] = useState(null);
    const navigate = useNavigate();

    async function saveNote(){
        try{
            setIsSaving(true);
            const currentTime = new Date().toISOString();
            note.date = currentTime;
            const response = await fetch('/notes/'+id, {
                method: "PUT",
                body: JSON.stringify(note),
                headers: {
                    "Content-Type": "application/json"
                },
            });
            await fetchNotes();
            setIsSaving(false);
            setIdSaved(id);
            setIsSaved(true);
        }
        catch(e){
            console.error("Erreur à la modification de la note - "+e);
            apiErrorToast();
        }
    }

    async function deleteNote(){
        Swal.fire({
            title: "Vous êtes sûr(e) ?",
            text: "Cette action est irréversible !",
            icon: "warning",
            iconColor: "#d33",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Supprimer",
            cancelButtonText: "Annuler",
            background: "#2c3338",
            color: "white"
          }).then(async (result) => {
            if (result.isConfirmed) {
                try{
                    const response = await fetch('/notes/'+id, {
                        method: "DELETE",
                    });
                    navigate("/");
                    toast.success('Note supprimée.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    fetchNotes();
                    
                }
                catch(e){
                    console.error("Erreur à la suppression de la note - "+e);
                    apiErrorToast();
                }
            }
          });
    }

    useEffect(() => {
        setNote(notes.find(note => note.id === parseInt(id)));
        if(id!=idSaved){
            setIsSaved(false);
        }
    }, [id, notes]);

    if(!note){
        return(
            <Loader />
        );
    }

    return (
        <form className="Form" onSubmit={(event) => {event.preventDefault(); saveNote();}}>
            <input className="Note-editable Note-title" type="text" value={note.title} onChange={(event) => {setNote({...note, title: event.target.value}); setIsSaved(false);}}/>
            <textarea className="Note-editable Note-content" value={note.content} onChange={(event) => {setNote({...note, content: event.target.value}); setIsSaved(false);}}/>
            <div className="Note-actions">
                <div className="Note-action">
                    <button className="Button">Enregistrer</button>
                    { isSaving ? <SaveLoader /> : isSaved ? <div>Enregistré</div> : null}
                </div>
                <button className="Button Button-delete" onClick={(event) => {event.preventDefault(); deleteNote();}}>Supprimer</button>
            </div>
        </form>
    );

}

export default Note;