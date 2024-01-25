import { useState } from 'react';
import Loader from '../Components/Loader';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import NoteList from '../Components/NoteList';
import Note from '../Components/Note';
import TrashList from '../Components/TrashList';


function Aside({ notes, fetchNotes, apiErrorToast, currentUser, isTrashViewEnabled, setIsTrashViewEnabled }){
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const currentID = location.pathname.split("/").pop();
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 4; // Nombre de notes par page
    var totalPages=null;
    {notes !== null ? totalPages = Math.ceil(notes.length / notesPerPage) : totalPages = 0}
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    var currentNotes=null;
    {notes !== null ? currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote) : currentNotes = 0};
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode', !isDarkMode);
    };

    const renderPaginationButtons = () => {
        const pageButtons = [];
        if(totalPages !== null){
            for (let i = 1; i <= totalPages; i++) {
                pageButtons.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={currentPage === i ? 'active' : ''}
                >
                    {i}
                </button>
                );
            }
        }
        return pageButtons;
    };

    function resetSearchInput(){
        setSearchQuery("");
    }

    async function appendNewNote(){
        try{
            const currentTime = new Date().toISOString();
            const response = await fetch("/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "Nouvelle note",
                    content: "",
                    date: currentTime,
                    pinned: false,
                })
            });
            const newNote = await response.json();
            navigate("/notes/"+newNote.id);
            fetchNotes();
        }
        catch(e){
            console.error("Erreur à l'ajout d'une note - "+e);
            apiErrorToast();
        }
    }

    function highlightSearchTerms(text, searchQuery) {
        if (searchQuery==="") return text;
      
        const regex = new RegExp(`(${searchQuery})`, 'gi');
        return text.split(regex).map((part, index) => 
            regex.test(part) ? <mark key={index}>{part}</mark> : part
        );
    }

    async function pinNote(id){
        const note = notes.find(note => note.id === id);
        try{
            {note.pinned ? note.pinned = false : note.pinned = true}
            const response = await fetch('/notes/'+id, {
                method: "PUT",
                body: JSON.stringify(note),
                headers: {
                    "Content-Type": "application/json"
                },
            });
        }
        catch(e){
            console.error("Erreur à la modification du statut 'épinglé' de la note - "+e);
            apiErrorToast();
        }
    }

    async function checkNote(id){
        const note = notes.find(note => note.id === id);
        try{
            {note.checked ? note.checked = false : note.checked = true}
            const response = await fetch('/notes/'+id, {
                method: "PUT",
                body: JSON.stringify(note),
                headers: {
                    "Content-Type": "application/json"
                },
            });
        }
        catch(e){
            console.error("Erreur à la modification du statut 'faite' de la note - "+e);
            apiErrorToast();
        }
    }

    return(
        <aside className='Side'>
            {notes !== null ? (
                <>
                    <div className='Status'>
                        {currentUser && <span>Connecté en tant que {currentUser.name}</span>}
                    </div>
                    <div className='Header'>
                        {isTrashViewEnabled ? null : 
                            <button onClick={appendNewNote} className='Button Button-create-note'>+</button>
                        }
                        <div className='SearchBar'>
                            <input placeholder='Rechercher' value={searchQuery} onChange={event => setSearchQuery(event.target.value)} className='Search SearchInput'/>
                            <button className='Search SearchResetButton' onClick={resetSearchInput}>X</button>
                        </div>
                    </div>
                    {isTrashViewEnabled ?
                        <TrashList 
                            notes={notes}
                            searchQuery={searchQuery}
                            currentID={currentID}
                            highlightSearchTerms={highlightSearchTerms}
                            pinNote={pinNote}
                            isDarkMode={isDarkMode}
                            checkNote={checkNote}
                            currentNotes={currentNotes}
                        />
                    :
                        <NoteList 
                            notes={notes}
                            searchQuery={searchQuery}
                            currentID={currentID}
                            highlightSearchTerms={highlightSearchTerms}
                            pinNote={pinNote}
                            isDarkMode={isDarkMode}
                            checkNote={checkNote}
                            currentNotes={currentNotes}
                        />
                    }    
                    <div className='Trash'>
                        <button className='TrashButton' onClick={() => {setIsTrashViewEnabled(!isTrashViewEnabled); navigate("/");}}>
                            <img 
                                src={isTrashViewEnabled ? '/images/back.png' : '/images/trash.png'}
                            />
                            {isTrashViewEnabled ? 'Notes' : 'Corbeille'}
                        </button>
                    </div>
                    <div className='Pagination'>
                        {renderPaginationButtons()}
                    </div>
                    <button onClick={toggleDarkMode} className='ToggleThemeButton'>
                        {isDarkMode ? 'Mode Nuit' : 'Mode Jour'}
                    </button>
                </>
            ) : <Loader />}
        </aside>
    );
}

export default Aside;