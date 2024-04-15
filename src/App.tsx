import { useState } from 'react';
import './App.css';
import Dropzone from './components/Dropzone/Dropzone';
import Viewer from './components/Viewer/Viewer';


const App = () => {
  const [core, setCore]=useState<any>();
  return (
    <div className="App">

      <Dropzone core={core} />
      <Viewer docToLoad='/files/PDFTRON_about.pdf' setCore={setCore}/>
      <Viewer docToLoad='/files/Newsletter.docx' setCore={setCore}/>
    </div>
  );
};

export default App;