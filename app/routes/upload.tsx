import { useEffect, useState, type FormEvent } from "react";
import type { Route } from "./+types/home";
import { FileUploader } from '../component'
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "contants";
//import { pdfPageToImage } from "~/lib/pdf2img";
//import { pdfToImages } from "~/lib/pdf2img";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "RAnalyser" },
        { name: "description", content: "Analyse your Resume" },
    ];
}
export default function Upload() {
    const [statusText, setStatusText] = useState('Loading Analysing Service');
    const [isProcessing, setIsProcessing] = useState(true);
    const [file, setFile] = useState<File | null>(null);
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();

    const handleFileSelect = (newFile: File | null) => {
        console.log('Selected file:', file);
        setFile(newFile)
    }
    useEffect(() => {

        const timer = setTimeout(() => setIsProcessing(false), 2000);
        //  if(!auth.isAuthenticated) navigate('/auth?next=/upload');
        return () => clearTimeout(timer);
    }, [])

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }:
        { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);

        setStatusText('Uploading the file...');
        const uploadedFile = await fs.upload([file]);
        if(!uploadedFile) return setStatusText('Error: Failed to upload file');
/*
        setStatusText('Converting to image...');
        const imageFile = await pdfPageToImage(file);
        if(!imageFile.length) return setStatusText('Error: Failed to convert PDF to image');

        setStatusText('Uploading the image...');
        const uploadedImage = await fs.upload([imageFile [0].file]);
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');
        */

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: '/images/resume_02.jpg',
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');

        console.log(form)
        console.log(e)
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        console.log(formData)
        console.log(companyName)

        if (!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }


    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}

                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={6} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}


