import { useParams } from "react-router-dom";
import './Note.css';
import MiniLoader from "./MiniLoader";
import Loader from './Loader';
import { useEffect, useState } from "react";

function Note({notes, onSaveReFetch}){
    const { id } = useParams();
    const note = notes ? notes.find(note => note.id === parseInt(id)) : null;
    const [editableNote, setEditableNote] = useState(note);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    async function saveNote(){
        setIsSaving(true);
        const response = await fetch('/notes/'+id, {
            method: "PUT",
            body: JSON.stringify(editableNote),
            headers: {
                "Content-Type": "application/json"
            },
        });
        await onSaveReFetch();
        setIsSaving(false);
        setIsSaved(true);
    }

    useEffect(() => {
        setEditableNote(note);
        setIsSaved(false);
    }, [id]);

    if(!editableNote){
        return(
            <Loader />
        );
    }

    return (
        <form className="Form" onSubmit={(event) => {event.preventDefault(); saveNote();}}>
        <input className="Note-editable Note-title" type="text" value={editableNote.title} onChange={(event) => {setEditableNote({...editableNote, title: event.target.value}); setIsSaved(false);}}/>
        <textarea className="Note-editable Note-content" value={editableNote.content} onChange={(event) => {setEditableNote({...editableNote, content: event.target.value}); setIsSaved(false);}}/>
        <div className="Note-actions">
            <button className="Button">Enregistrer</button>
            { isSaving ? <MiniLoader /> : isSaved ? <div>Enregistré</div> : null}
        </div>
        </form>
    );

}

export default Note;