import { useParams } from "react-router-dom";
import './Note.css';
import Loader from './Loader';
import { useEffect, useState } from "react";

function Note({notes}){
    const { id } = useParams();
    const note = notes ? notes.find(note => note.id === parseInt(id)) : null;
    const [editableNote, setEditableNote] = useState(note);

    async function saveNote(){
        const response = await fetch('/notes/'+id, {
            method: "PUT",
            body: JSON.stringify(editableNote),
            headers: {
                "Content-Type": "application/json"
            },
        });
    }

    useEffect(() => {
        setEditableNote(note);
    }, [id, note]);

    if(!editableNote){
        return(
            <Loader />
        );
    }

    return (
        <form className="Form" onSubmit={(event) => {event.preventDefault(); saveNote();}}>
        <input className="Note-editable Note-title" type="text" value={editableNote.title} onChange={(event) => {setEditableNote({...note, title: event.target.value})}}/>
        <textarea className="Note-editable Note-content" value={editableNote.content} onChange={(event) => {setEditableNote({...note, content: event.target.value})}}/>
        <div className="Note-actions">
            <button className="Button">Enregistrer</button>
        </div>
        </form>
    );

}

export default Note;