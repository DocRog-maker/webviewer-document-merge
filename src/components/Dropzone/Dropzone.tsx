import { WebViewerInstance } from '@pdftron/webviewer';
import { DragEvent, useEffect, useRef, useState } from 'react';
import './styles.css';

//CoreControls was replaced with Core in Apryse 8.0
interface DropzoneProps {
    core: WebViewerInstance["Core"]
}
const Dropzone = ({ core }: DropzoneProps) => {
    const dropRef = useRef(null);
    const fileListRef = useRef(null);
    const [docs, addDocument] = useState([]);
    const [thumbArray, addThumbToArray] = useState([]);

    useEffect(() => {
        if (docs.length >= 1) {
            const loadDocumentAndThumb = async () => {
                const doc = await core.createDocument(docs[docs.length - 1]);

                //prior to  8.3 , the method loadThumbnailAsync was used.
                // @ts-ignore
                doc.loadThumbnail(1, thumbnail => {
                    // @ts-ignore
                    addThumbToArray([...thumbArray, thumbnail]);
                });
            }
            loadDocumentAndThumb();
        }
    }, [docs]);

    const mergeDocuments = async () => {
        if (docs.length > 0) {
            const doc = await core.createDocument(docs[0]);
            let i;
            for (i = 1; i < docs.length; i++) {
                let doc2 = await core.createDocument(docs[i]);
                await doc.insertPages(doc2);
            }

            const data = await doc.getFileData();
            const arr = new Uint8Array(data);
            const blob = new Blob([arr], { type: 'application/pdf' });
            downloadBlob(blob);
        }
        addDocument([]);
    };

    const downloadBlob = (blob: Blob) => {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'merged-file.pdf';
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 0);
    };

    const onDropEvent = (ev: DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
        const viewerID = ev.dataTransfer.getData('dataTransferWebViewerFrame');
        const otherWebViewerIframe = window.parent.document.querySelector(
            `#${viewerID}`,
        );
        if (!otherWebViewerIframe) {
            console.warn('Could not find other instance of WebViewer');
        }


        const extractedDataPromise =
            // @ts-ignore
            otherWebViewerIframe?.contentWindow.extractedDataPromise;
        if (!extractedDataPromise) {
            console.warn('Could not retrieve data from other instance of WebViewer');
        }

        // @ts-ignore
        extractedDataPromise.then(docToMerge => {
            // @ts-ignore
            addDocument([...docs, docToMerge]);
        });
    };

    return (
        <div>
            <div
                className="dropDiv"
                ref={dropRef}
                onDrop={ev => {
                    onDropEvent(ev);
                }}
                onDragOver={ev => {
                    ev.preventDefault();
                    ev.dataTransfer.dropEffect = 'move';
                }}
            >
                <p>Drop the thumbs from the viewers here</p>
                <button onClick={mergeDocuments}>Download</button>
            </div>
            <div className="list" ref={fileListRef}>
                {thumbArray.map((thumb, i) => {
                    // @ts-ignore
                    return <img key={i} src={thumb.toDataURL()} />
                })}
            </div>
        </div>
    );
};

export default Dropzone;
