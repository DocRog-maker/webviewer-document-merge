import './App.css';
import Dropzone from './components/Dropzone/Dropzone';
import Viewer from './components/Viewer/Viewer';


const App = () => {
  return (
    <div className="App">

      <Dropzone />
      <Viewer docToLoad='/files/PDFTRON_about.pdf'/>
      <Viewer docToLoad='/files/Newsletter.docx' />
    </div>
  );
};

export default App;