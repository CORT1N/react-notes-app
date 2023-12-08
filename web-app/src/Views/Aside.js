import { useState } from 'react';
import Loader from '../Components/Loader';
import { Link, useNavigate, useLocation} from 'react-router-dom';


function Aside({ notes, fetchNotes }){
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const currentID = location.pathname.split("/").pop();

    function resetSearchInput(){
        setSearchQuery("");
    }

    async function appendNewNote(){
        const response = await fetch("/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: "Nouvelle note",
            content: "",
          })
        });
        const newNote = await response.json();
        navigate("/notes/"+newNote.id);
        fetchNotes();
    }

    function highlightSearchTerms(text, searchQuery) {
        if (searchQuery=="") return text;
      
        const regex = new RegExp(`(${searchQuery})`, 'gi');
        return text.split(regex).map((part, index) => 
            regex.test(part) ? <mark key={index}>{part}</mark> : part
        );
    }

    return(
        <aside className='Side'>
            {notes !== null ? (
                <>
                    <div className='Header'>
                        <button onClick={appendNewNote} className='Button Button-create-note'>+</button>
                        <div className='SearchBar'>
                            <input placeholder='Rechercher' value={searchQuery} onChange={event => setSearchQuery(event.target.value)} className='Search SearchInput'/>
                            <button className='Search SearchResetButton' onClick={resetSearchInput}>X</button>
                        </div>
                    </div>
                    <ol className='Note-list'>
                        {notes.filter(note => {
                            if(searchQuery === ""){
                                return note;
                            }else if(note.title.toLowerCase().includes(searchQuery.toLowerCase())){
                                return note;
                            }else if(note.content.toLowerCase().includes(searchQuery.toLowerCase())){
                                return note;
                            }
                        }).map((note) => (
                            <li key={note.id}>
                                <Link to={"/notes/"+note.id} className={note.id === parseInt(currentID) ? 'Note-link active' : 'Note-link'}>
                                    <div className='Note-link-container'>
                                        <div>{highlightSearchTerms(note.title, searchQuery)}</div>
                                        <div className='Note-link-content'>{highlightSearchTerms(note.content.substring(0,20), searchQuery)}{note.content.length>=20 ? "..." : null}</div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ol>
                </>
            ) : <Loader />}
        </aside>
    );
}

export default Aside;