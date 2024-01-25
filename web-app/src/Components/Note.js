import { useParams, useNavigate } from "react-router-dom";
import './Note.css';
import SaveLoader from "./SaveLoader";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import Swal from 'sweetalert2'
import { toast } from "react-toastify";
import { useDebouncedEffect } from './useDebouncedEffect';
import ReactMarkdown from 'react-markdown';
import BasicModal from "./BasicModal";

function Note({ notes, fetchNotes, apiErrorToast, isDarkMode, setIsDarkMode, tags }){
    const { id } = useParams();
    const [note, setNote] = useState(notes.find(note => note.id === parseInt(id)));
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [idSaved, setIdSaved] = useState(null);
    const navigate = useNavigate();
    const [markdownPanelEnabled, setMarkdownPanelEnabled] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    async function saveNote(){
        try{
            if(!isSaved){
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
        }
        catch(e){
            console.error("Erreur à la modification de la note - "+e);
            apiErrorToast();
        }
    }

    async function trashNote(){
        Swal.fire({
            title: "Vous êtes sûr(e) ?",
            text: "La note sera envoyée dans la corbeille.",
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
                    note.inTrash = true;
                    const response = await fetch('/notes/'+id, {
                        method: "PUT",
                        body: JSON.stringify(note),
                        headers: {
                            "Content-Type": "application/json"
                        },
                    });
                    navigate("/");
                    toast.success('Note envoyée dans la corbeille.', {
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

    // Utilisation de useDebouncedEffect pour déclencher la sauvegarde automatique après un délai de 1000ms (seulement si l'user a commencé à éditer)
    useDebouncedEffect(() => {
        if(isEditing){
            saveNote();
        }
    }, [note], 1000);

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
                <form className="Form" onSubmit={(event) => {event.preventDefault(); saveNote();}}>
                    <input className="Note-editable Note-title" type="text" value={note.title} onChange={(event) => {setNote({...note, title: event.target.value}); setIsSaved(false); setIsEditing(true);}}/>
                    <textarea className="Note-editable Note-content" value={note.content} onChange={(event) => {setNote({...note, content: event.target.value}); setIsSaved(false); setIsEditing(true);}}/>
                    <div className="Note-actions">
                        <div className="Note-action">
                            <BasicModal
                                className='Button Button-Etiquettes'
                                isDarkMode={isDarkMode}
                                tags={tags}
                                note={note}
                                apiErrorToast={apiErrorToast}
                                saveNote={saveNote}
                            />
                        </div>
                        <div className="Note-action">
                            { isSaving ? <SaveLoader /> : isSaved ? <div>Enregistré</div> : isEditing ? null : <span className="Note-date">{note.date}</span>}
                        </div>
                        <div className="Note-action-right">
                            <button className="Button Button-delete" onClick={(event) => {event.preventDefault(); trashNote();}}>Supprimer</button>
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

export default Note;