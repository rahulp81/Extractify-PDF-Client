import FileForm from './_components/Form'

export default function Home() {
  return (
    <main className=" formcontainer  py-3 mt-5 flex flex-col items-center  gap-5 ">
      <h1 className='font-extrabold text-4xl'>
        Split PDF
      </h1>
      <FileForm />
      <article className='flex  gap-5 py-5 w-full max-w-[1200px] mx-auto justify-between items-center max-[1000px]:flex-col  '>
        <h2 className='text-xl font-semibold break-words text-center '>
          How to Extract and Edit PDF pages from extractifyPDf:
        </h2>
        <ol className="list-decimal break-words max-w-[500px]  list-inside  ">
          <li>First Click in above Section to open up a File Selector </li>
          <li>Select a .pdf format Pdf file</li>
          <li>Click on the Upload button and wait for file to upload</li>
          <li>Once File has been sucessfully uploaded you will redirected to
            Editing Page where you can Extract Pages from PDF and create a new PDF from the same</li>
        </ol>
      </article>
    </main>
  )
}
