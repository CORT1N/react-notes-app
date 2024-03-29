import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Note from './Components/Note';
import Loader from './Components/Loader';
import Aside from './Views/Aside'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import TrashNote from './Components/TrashNote';


//  CYCLE DE VIE du composant App:
//  1. rendu initial (avec les valeurs d'état initiales)
//  2. exécution de l'action du 'useEffect' : mise à jour de l'état
//  3. ce qui fait automatiquement un nouveau rendu

function App() {
  //déclarer l'état pour stocker les notes
  const [notes, setNotes] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isTrashViewEnabled, setIsTrashViewEnabled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tags, setTags] = useState(null);

  const apiErrorToast = () => toast.error("Base de données indisponible.", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  async function fetchNotes(){
    try{
      const response = await fetch('/notes?_sort=date&_order=desc');
      const data = await response.json();
      setNotes(data);
    }catch(e){
      console.error("Erreur au chargement des notes - "+e);
      apiErrorToast();
    }
  }

  async function fetchTags(){
    try{
      const response = await fetch('/tags');
      const data = await response.json();
      setTags(data);
    }catch(e){
      console.error("Erreur au chargement des libellés - "+e);
      apiErrorToast();
    }
  }

  async function fetchCurrentUser(){
    try{
      const response = await fetch('/profile');
      const data = await response.json();
      setCurrentUser(data);
    }catch(e){
      console.error("Erreur au chargement de l'utilisateur connecté - "+e);
      apiErrorToast();
    }
  }

  useEffect(() => {
    fetchNotes();
    fetchCurrentUser();
    fetchTags();
  }, []);

  return (
    <BrowserRouter>
      <Aside 
        notes={notes}
        fetchNotes={fetchNotes}
        apiErrorToast={apiErrorToast}
        currentUser={currentUser}
        isTrashViewEnabled={isTrashViewEnabled}
        setIsTrashViewEnabled={setIsTrashViewEnabled}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        tags={tags}
      />
      <main className='Main'>
        {notes !== null ? (
          <Routes>
            <Route path="/" element={<span className='NoNoteSelected'>Sélectionner une note</span>}/>
            <Route
              path="/notes/:id" 
              element={
                isTrashViewEnabled ?
                <TrashNote 
                notes={notes}
                fetchNotes={fetchNotes}
                apiErrorToast={apiErrorToast}
                setIsTrashViewEnabled={setIsTrashViewEnabled}
                />
                : 
                <Note 
                  notes={notes}
                  fetchNotes={fetchNotes}
                  apiErrorToast={apiErrorToast}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                  tags={tags}
                  fetchTags={fetchTags}
                />
              }
            />
            <Route path="*" element={<Navigate to="/"/>} />
          </Routes>
        ) : <Loader />}
      </main>
      <ToastContainer />
    </BrowserRouter>
  );

}

export default App;
