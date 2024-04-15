import WebViewer, { WebViewerInstance } from '@pdftron/webviewer';
import { useEffect, useRef } from 'react';

interface ViewerProps {
    docToLoad: string,
    setCore: React.Dispatch<React.SetStateAction<WebViewerInstance["Core"]>>;
}

const Viewer = ({ docToLoad, setCore }: ViewerProps) => {
    const viewer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        WebViewer(
            {
                path: 'lib',
                initialDoc: docToLoad,
                loadAsPDF: true,
            },
            viewer.current as HTMLDivElement,
        ).then((instance) => {
            instance.UI.enableFeatures([
                instance.UI.Feature.MultipleViewerMerging,
            ]);
            instance.UI.enableElements(['documentControl']);
            instance.UI.openElements(['leftPanel']);
            setCore(instance.Core);
        });
    }, []);

    return <div className="webviewer" ref={viewer} ></div>;
};

export default Viewer;
