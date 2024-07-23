import "@neongamerbot/credits";

import React, { useEffect, useState } from 'react';
// import 'react-pdf/dist/Page/TextLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
type Cert = {
  parent: string;
  child: string[];
}
function App() {
  const apiUrl = isDev ? './example.json' : './certs.php'
  const [certs, setCerts] = useState<null | Cert[]>(null)
  const [pdfPath, setPDFPath] = useState<null | Cert>(window.location.hash.slice(1) ? JSON.parse(atob(window.location.hash.slice(1))) as Cert : null)
  useEffect(() => {
    if(!certs) {
      fetch(apiUrl).then(r=>r.json()).then(json => setCerts(json))
    }
  })
const setPdf = (c:string, parent: string) => () => {
  const obj = {
    child: [c],
    parent
  }
  window.location.hash = `#${btoa(JSON.stringify(obj))}`
  setPDFPath(obj)
} 
  return (
<div className="hero min-h-screen" style={{ background: "var(--mantle)"}}>
  <div className="hero-content text-center">
    <div className="max-w-md">
     {pdfPath ? <div>
      <h1 className="text-5xl font-bold mb-5 ">{pdfPath.parent} - {pdfPath.child[0].split('.')[0]}</h1>
      <div className='mt-10'>
        {pdfPath.child[0].endsWith('.pdf') ? <>
        <PdfRender pdf={`./certs/${pdfPath.parent}/${pdfPath.child[0]}`} />
        </>: <div>
          <img loading='lazy' src={pdfPath.child[0]}  alt="Cert"/>
          </div>}
      </div>

     </div>: <>
      <h1 className="text-5xl font-bold">Certificates</h1>
      <div className='grid gap-2 grid-cols-1'>
    { certs? certs.map((d) => {
      return <div key={d.parent} className='shadow-lg rounded p-5 bg-base-100 md:m-5 m-2'>
        <h3 className='font-bold text-2xl'>{d.parent}</h3>
        <ul>
          {d.child.map((c,i) => {
            return <li key={i} className='li marker m-2' style={{ listStyleType: 'marker' }}><button onClick={setPdf(c, d.parent)}>{c}</button></li>
          })}
        </ul>
      </div>
    }): null}
      </div></>}
    </div>
  </div>
</div>
  );
}
function PdfRender({ pdf }: { pdf: string }) {
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess} options={{ verbosity: isDev ? 1 : 0 }}>
        <Page pageNumber={pageNumber}  scale={width > 786  ? 0.7 : 0.4} canvasBackground={"var(--mantle)"}   renderAnnotationLayer={false} renderTextLayer={false} />
      </Document>
    </div>
  );
}
export default App;
