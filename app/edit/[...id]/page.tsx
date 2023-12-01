"use client"
import React, { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import useWindowSize from '@/lib/customHooks/useWindowSize';
import { FaScissors } from "react-icons/fa6";
import LoadingSpinner from '@/app/_components/LoadingSpinner';
import Link from 'next/link';
import { IoGrid } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";
import ExtractLoading from '@/app/_components/ExtractLoading';
import toast, { Toaster } from 'react-hot-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

function Page1({ params }: { params: { id: string } }) {
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [splitAfterPage, setSplitAfterPage] = useState<number | null>(null);
  const isMobileScreen = useWindowSize() < 900 ? true : false;
  const [extracting, setExtracting] = useState<{ hasLoaded: boolean, intiated: boolean, error: boolean }>()
  const [downloadFileName, setDownloadFileName] = useState('')

  const downLoadLinkRef = useRef<string>('');

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };


  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(`https://extractify-pdf-server-production.up.railway.app/edit/${params.id}`);
        if (!response.ok) {
          setError(true)
          return
        }
        // Converting File to Binary Large Object
        const blob = await response.blob();
        const pdfBlobUrl = URL.createObjectURL(blob);
        setPdfUrl(pdfBlobUrl);
      } catch (error) {
        console.error('Error loading PDF:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, []);


  if (error) {
    return <h2 className='text-center mt-10'>
      File Missing, Corrupted or Doesnt Exist <Link className='ml-1 underline' href={'/'}>Re Upload</Link>
    </h2>
  }

  const handleDownloadClick = () => {
    if (downLoadLinkRef.current) {
      // Creating a tag to utlizie its download attribute and programmatically clicking to trigger download.
      const downloadLink = document.createElement('a');
      downloadLink.href = downLoadLinkRef.current;
      downloadLink.download = downloadFileName;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };


  if (extracting?.intiated) {
    return (
      !extracting.hasLoaded ?
        <h2 className='text-center flex-col justify-center formcontainer font-medium flex  text-[20px] mt-10'>
          <ExtractLoading />
          <span>Extracting PDF</span>
        </h2> : extracting.error ?
          <h2 className='text-center flex-col justify-center formcontainer font-medium flex  text-[20px] mt-10'>
            File Failed to Process Please Refresh and Try Again.
          </h2> :
          <main className='formcontainer mt-14 items-center flex flex-col gap-2'>
            <span className='text-lg'>Your File has been Processed !</span>
            <label htmlFor="change-filename" className=' flex flex-col gap-0.5'>
              <span>File Name:</span>
              <input id='change-filename' className='outline-none border-green-500 border-2 rounded p-1 '
                value={downloadFileName} type="text" onChange={(e) => setDownloadFileName(e.currentTarget.value)} />
            </label>
            <button className='bg-green-500 text-white font-semibold rounded-lg px-4 py-2.5 max-w-[150px]'
              onClick={handleDownloadClick}> Download</button>
            <Link href={'/'}>
              <button className=" text-emerald-700 font-semibold rounded-lg px-4 py-2.5 bg-[url('/bg-pattern.png')]">
                Upload Another File</button>
            </Link>
          </main>
    )
  }





  function handlePageSelection(i: number) {
    setSplitAfterPage(null);
    setSelectedPages((prev) => {
      const prevArr = [...prev];

      // Check if the page Number is already selected
      const index = prevArr.indexOf(i);

      if (index !== -1) {
        // If selected, remove it
        prevArr.splice(index, 1);
      } else {
        // If not selected, add it
        prevArr.push(i);
      }

      return prevArr;
    });
  }

  function handleSplitAfterSelection(i: number) {
    setSplitAfterPage(i);
    const selectedPageAfterSplit: number[] = [];
    for (let index = i + 1; index <= numPages!; index++) {
      selectedPageAfterSplit.push(index);
    }
    setSelectedPages(selectedPageAfterSplit)
  }


  function handleReset() {
    setSelectedPages([])
    setSplitAfterPage(null)
  }

  function handleSelectAll() {
    setSelectedPages(Array.from({ length: numPages! }, (_, index) => index + 1))
    setSplitAfterPage(null)
  }


  async function handleFileExtract() {
    try {
      setExtracting({ intiated: true, hasLoaded: false, error: false });
      const res = await fetch(`https://extractify-pdf-server-production.up.railway.app/extract/${params.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedPages: selectedPages.sort((a, b) => a - b).map(page => page - 1)
        }),
      })
      if (!res.ok) {
        throw new Error('')
      }
      const contentDispositionHeader = res.headers.get('Content-Disposition');
      // regex for finding the matches for 'filename'
      const matches = contentDispositionHeader?.match(/filename=(.+)/);
      const filename = matches ? matches[1] : 'modified.pdf';
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      downLoadLinkRef.current = url;
      setDownloadFileName(filename)
      setExtracting({ intiated: true, hasLoaded: true, error: false })
    } catch (error) {
      toast.error('Failed to Process')
      setExtracting({ intiated: true, hasLoaded: true, error: true })
    }
  }





  const renderThumbnails = () => {
    const thumbnails = [];
    for (let i = 1; i <= numPages!; i++) {
      const isSelectedPage = selectedPages.includes(i);
      thumbnails.push(
        <div key={`thumbnail_${i}`} className={`group  items-center gap-5 p-5 ${isMobileScreen ? 'border-b-2' : 'border-r-2'}
         border-dashed border-red-600 border-opacity-0 rounded-md cursor-pointer hover:bg-green-100 flex-col flex relative justify-between
        ${isSelectedPage ? ' bg-green-100 ' : splitAfterPage == i && 'border-opacity-100'}`}
          onClick={() => handlePageSelection(i)}>
          <div className='flex justify-between top-0 absolute w-full'>
            <button className='border border-slate-500 p-1 overflow-clip rounded-md w-[25px] h-[25px]  z-50 bg-white  m-1 shadow-2xl
             shadow-black  group'>
              <div className={`rounded w-full h-full ${isSelectedPage ? 'bg-green-600 ' : 'group-hover:bg-slate-200'} `}></div>
            </button>
            {(i != numPages) &&
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger className='z-[100]'>
                    <div className={`border ${isMobileScreen ? 'opacity-100' : 'opacity-0  group-hover:opacity-100'} rounded-md z-50 bg-white
               m-1 shadow-2xl shadow-black p-2.5 hover:bg-slate-100`}
                      onClick={(e) => { e.stopPropagation(); handleSplitAfterSelection(i) }} >
                      <FaScissors style={{ "color": "red" }} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Split After Pages</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
          </div>
          <Page pageNumber={i} width={192} height={150} className={''} renderTextLayer={false} />
          <span className={`font-mono max-w-fit py-1.5 px-3 text-sm ${isSelectedPage ? 'bg-green-400' : 'bg-slate-200'} rounded-md`}>
            Page : {i}</span>
        </div>

      );
    }
    return thumbnails;
  };


  const UtilityButtons = () => {
    return (
      <div className='flex gap-3 justify-center flex-wrap ml-2 grow '>
        <button className='border justify-center items-center gap-2 rounded-md flex p-2.5 hover:bg-slate-100' onClick={handleSelectAll}>
          <span>Select All</span>
          <IoGrid color={'#18A558'} size={15} />
        </button>
        <button className='border justify-center items-center gap-2 rounded-md flex p-2.5 hover:bg-slate-100' onClick={handleReset}>
          <span>Reset</span>
          <GrPowerReset size={15} />
        </button>
      </div>
    )
  }


  // `url/edit/${params.id} the rest api for fetching pdf`

  const handleLoadError = () => {
    setError(true);
  };

  return (
    <main className='formcontainer my-8 flex flex-col gap-8 '>
      <header className='text-center'>
        <h2 className='text-3xl font-bold mb-2.5'>Split / Extract PDF</h2>
        <a className=" hover:text-blue-600 rounded  border text-black py-1 px-2 mx-auto  text-center bg-[url('/bg-pattern.png')]"
          target="_blank" href={pdfUrl}>
          View PDF File
        </a>
      </header>
      {loading ?
        <LoadingSpinner /> :
        <>
          {isMobileScreen && <UtilityButtons />}
          <div className={`flex mx-auto  flex-wrap gap-3 items-center justify-between w-full ${isMobileScreen && 'order-3'} `}>
            {!isMobileScreen && <UtilityButtons />}
            <button className={`${selectedPages.length ? "bg-green-500" : "bg-green-300 cursor-not-allowed"} min-w-[200px] min-h-[50px]
            flex flex-col font-semibold items-center py-2 px-2 rounded-xl  justify-center text-center my-4
             text-white  ${isMobileScreen ? 'mx-auto' : ' ml-auto'}`}
              onClick={handleFileExtract}
              disabled={selectedPages.length < 1} >
              <span>Extract/Split</span>
              <span>{selectedPages.length + ' Selected Pages'}</span>
            </button>
          </div>
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={handleLoadError}>
            <div className={`flex gap-6 flex-wrap ${isMobileScreen && 'justify-center flex-col'}`}>
              {numPages && numPages > 0 && renderThumbnails()}
            </div>
          </Document>
        </>
      }
      <Toaster />
    </main>
  );
}

export default Page1;





// For ordering in future version where in you can arrange page no and order
// const renderThumbnails = () => {
//   return <>
//     {pageOrder.map((pageNumber) => {
//       const isSelectedPage = selectedPages.includes(pageNumber);
//       return (
//         <div draggable key={`thumbnail_${pageNumber}`} className={`group  items-center gap-5 p-5 ${isMobileScreen ? 'border-b-2' : 'border-r-2'}
//        border-dashed border-red-600 border-opacity-0 rounded-md cursor-move hover:bg-green-100 flex-col flex relative justify-between
//       ${isSelectedPage ? ' bg-green-100 ' : splitAfterPage == pageNumber && 'border-opacity-100'}`}
//           onClick={() => handlePageSelection(pageNumber)}>
//           <div className='flex justify-between top-0 absolute w-full'>
//             <button className='border border-slate-500 p-1 overflow-clip rounded-md w-[25px] h-[25px]  z-50 bg-white  m-1 shadow-2xl
//            shadow-black  group'>
//               <div className={`rounded w-full h-full ${isSelectedPage ? 'bg-green-600 ' : 'group-hover:bg-slate-200'} `}></div>
//             </button>
//             {(pageNumber != numPages) &&
//               <button className={`border ${isMobileScreen ? 'opacity-100' : 'opacity-0  group-hover:opacity-100'} rounded-md z-50 bg-white
//              m-1 shadow-2xl  p-2.5 hover:bg-slate-100`}
//                 onClick={(e) => { e.stopPropagation(); handleSplitAfterSelection(pageNumber) }} >
//                 <FaScissors style={{ "color": "red" }} />
//               </button>
//             }
//           </div>
//           <Page pageNumber={pageNumber} width={192} height={150} className={'shadow-lg'} renderTextLayer={false} />
//           <span className={`font-mono max-w-fit py-1.5 px-3 text-sm ${isSelectedPage ? 'bg-green-400' : 'bg-slate-200'} rounded-md`}>
//             Page : {pageNumber}</span>
//         </div>
//       )
//     })
//     }
//   </>
// };

