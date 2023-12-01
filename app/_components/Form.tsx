"use client"

import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast';
import { MdCancel } from "react-icons/md";


const Form = () => {
    const [pdfFile, setPdfFile] = useState('');
    const [pdfName, setPdfName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const router = useRouter();

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files as FileList);
        if (selectedFiles.length > 1) {
            toast.error('Please Select One PDF File');
        }
        if (selectedFiles.length == 0) {
            return;
        }
        if (selectedFiles[0].type !== 'application/pdf') {
            toast.error('Please Select .pdf File');
            return;
        }
        if (pdfFile.length > 0) {
            // Revoking Previous selected File links to free up resources
            URL.revokeObjectURL(pdfFile);
        }
        setPdfFile(URL.createObjectURL(selectedFiles[0]));
        setPdfName(selectedFiles[0].name);
        setSelectedFile(selectedFiles[0])
    }

    const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            if (!selectedFile) {
                toast.error('PDF File missing please select one and try again')
                return;
            }

            // Update api to use local host link when running locally
            const formData = new FormData();
            formData.append('pdfFile', selectedFile);
            const res = await fetch('https://extractify-pdf-server-production.up.railway.app/upload', {
                method: 'POST',
                body: formData,
            });

            const responseData: any = await res.json();

            if (res.ok) {
                toast.success('File Uploaded Sucessfully')
                router.push(`/edit/${responseData.path}`);
            } else {
                const errorData = responseData.message;
                throw new Error(errorData);
            }
        } catch (error: any) {
            toast.error('Failed to Upload, please check the File and try again')
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleRemoveFile() {
        setPdfFile('')
        setPdfName('')
        setSelectedFile(null)
    }


    return (
        <>
            <div className={`rounded-lg w-full p-3 bg-green-400  flex ${!pdfName.length && 'hover:cursor-pointer'}`}
                onClick={() => { !isLoading && !pdfName.length && document.getElementById('file')?.click() }} >
                <form onSubmit={handleFileUpload} id="" className=" border-2 bg-green-500 w-full gap-3 rounded-lg border-dashed flex-col
                flex justify-center items-center py-4">
                    <div className="flex w-full flex-col items-center gap-2">
                        <img src="/upload.svg" alt="" height={60} width={120} className="-mt-2" />
                        <button type="button" className="bg-white hover:bg-slate-300 rounded-md p-4 font-medium flex gap-1 mx-1"
                            onClick={(e) => {
                                e.stopPropagation()
                                document.getElementById('file')?.click()
                            }}>
                            <img src="/file-pdf.svg" alt="" />
                            CHOOSE PDF File
                        </button>
                        {
                            pdfName.length > 0 &&
                            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-1">
                                <a
                                    className=" hover:text-blue-600 rounded text-center text-black py-1 px-2 mx-1 roundedtext-center bg-[url('/bg-pattern.png')] "
                                    target="_blank"
                                    href={pdfFile}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Chosen File : <span className="underline">{pdfName}</span>
                                </a>
                                <button className="bg-white rounded-full hover:bg-slate-100 p-1" onClick={handleRemoveFile}>
                                    <MdCancel style={{ "color": "red" }} size={20} />
                                </button>
                            </div>

                        }
                        <input name="pdfFile" type="file" id="file" className="hidden" accept=".pdf" onChange={handleFileInput} />
                    </div>
                    {pdfFile && !!selectedFile &&
                        <button onClick={(e) => e.stopPropagation()} className={`bg-white p-2 rounded-lg w-[100px] font-medium
                            ${!isLoading && 'hover:bg-slate-200'}`} type="submit" >
                            {
                                isLoading ? <LoadingSpinner /> : 'Upload'
                            }
                        </button>
                    }
                </form>
            </div>
            <Toaster />
        </>
    );
};

export default Form;
