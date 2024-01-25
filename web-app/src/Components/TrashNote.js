import { useParams, useNavigate } from "react-router-dom";
import './Note.css';
import SaveLoader from "./SaveLoader";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import Swal from 'sweetalert2'
import { toast } from "react-toastify";
import { useDebouncedEffect } from './useDebouncedEffect';
import ReactMarkdown from 'react-markdown';


function TrashNote({ notes, fetchNotes, apiErrorToast, setIsTrashViewEnabled }){
    const { id } = useParams();
    const [note, setNote] = useState(notes.find(note => note.id === parseInt(id)));
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [idSaved, setIdSaved] = useState(null);
    const navigate = useNavigate();
    const [markdownPanelEnabled, setMarkdownPanelEnabled] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    async function deleteNote(){
        Swal.fire({
            title: "Vous êtes sûr(e) ?",
            text: "Cette action est irréversible !",
            icon: "warning",
            iconColor: "#d33",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Supprimer définitivement",
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
                    console.error("Erreur à la suppression définitive de la note - "+e);
                    apiErrorToast();
                }
            }
          });
    }

    async function restoreNote(){
        Swal.fire({
            title: "Voulez-vous restaurez la note ?",
            text: "Vous pourrez à nouveau la modifier.",
            icon: "question",
            iconColor: "white",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Restaurer",
            cancelButtonText: "Annuler",
            background: "#2c3338",
            color: "white"
          }).then(async (result) => {
            if (result.isConfirmed) {
                try{
                    note.inTrash = false;
                    const response = await fetch('/notes/'+id, {
                        method: "PUT",
                        body: JSON.stringify(note),
                        headers: {
                            "Content-Type": "application/json"
                        },
                    });
                    navigate("/notes/"+id);
                    toast.success('Note restaurée.', {
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
                    setIsTrashViewEnabled(false);
                }
                catch(e){
                    console.error("Erreur à la restauration de la note - "+e);
                    apiErrorToast();
                }
            }
          });
    }

    useEffect(() => {
        setNote(notes.find(note => note.id === parseInt(id)));
        if(id!=idSaved){
            setIsSaved(false);
            setIsEditing(false);
        }
    }, [id, notes]);

    if(!note){
        return(
            <Loader />
        );
    }

    return (
        <div className="Note-group">
            <div className="Note">
                <form className="Form" onSubmit={(event) => {event.preventDefault();}}>
                    <input className="Note-editable Note-title" type="text" value={note.title}/>
                    <textarea className="Note-editable Note-content" value={note.content}/>
                    <div className="Note-actions">
                        <div className="Note-action">
                            <button className="Button" onClick={(event) => {event.preventDefault(); restoreNote();}}>Restaurer</button>
                            <span className="Note-date">{note.date}</span>
                        </div>
                        <div className="Note-action-right">
                            <button className="Button Button-delete" onClick={(event) => {event.preventDefault(); deleteNote();}}>Supprimer définitivement</button>
                            <label for="markdownEnable">
                                Markdown ?
                            </label>
                            <input
                                type='checkbox'
                                checked={markdownPanelEnabled}
                                onChange={() => setMarkdownPanelEnabled(!markdownPanelEnabled)}
                                name="markdownEnable"
                            />
                        </div>
                    </div>
                </form>
            </div>
            {markdownPanelEnabled && (
                <div className="Markdown-preview-panel">
                    {/* Panneau de prévisualisation du format Markdown */}
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                </div>
            )}
        </div>
    );

}

export default TrashNote;