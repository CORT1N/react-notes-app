import { useParams } from "react-router-dom";
import './Note.css';
import SaveLoader from "./SaveLoader";
import { useEffect, useState } from "react";
import Loader from "./Loader";

function Note({notes, onSaveReFetch}){
    const { id } = useParams();
    const [note, setNote] = useState(notes.find(note => note.id === parseInt(id)));
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [idSaved, setIdSaved] = useState(null);

    async function saveNote(){
        setIsSaving(true);
        const response = await fetch('/notes/'+id, {
            method: "PUT",
            body: JSON.stringify(note),
            headers: {
                "Content-Type": "application/json"
            },
        });
        await onSaveReFetch();
        setIsSaving(false);
        setIdSaved(id);
        setIsSaved(true);
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
            <div className="Note-save">
                <button className="Button">Enregistrer</button>
                { isSaving ? <SaveLoader /> : isSaved ? <div>Enregistré</div> : null}
            </div>
            <button className="Button Button-delete" onClick={(event) => {event.preventDefault();}}>Supprimer</button>
        </div>
        </form>
    );

}

export default Note;