import WebViewer from '@pdftron/webviewer';
import { useEffect, useRef } from 'react';

interface ViewerProps {
    docToLoad: string,
}

const Viewer = ({ docToLoad }: ViewerProps) => {
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
        });
    }, []);

    return <div className="webviewer" ref={viewer} ></div>;
};

export default Viewer;
