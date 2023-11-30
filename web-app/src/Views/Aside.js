import Loader from '../Components/Loader';
import { Link, useNavigate } from 'react-router-dom';


function Aside({ notes, fetchNotes }){
    const navigate = useNavigate();

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

    return(
        <aside className='Side'>
            {notes !== null ? (
                <>
                    <button onClick={appendNewNote} className='Button Button-create-note'>+</button>
                    <ol className='Note-list'>
                        {notes.map((note) => (
                        <li key={note.id}>
                            <Link to={"/notes/"+note.id} className='Note-link'>
                                {note.title}
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