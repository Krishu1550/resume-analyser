import { useEffect, useState } from "react";
import  NavBar  from "~/component/navBar";
import ResumeCard from '../component/resumeCard'
import type { Route } from "./+types/home";
import { resumes } from "../../contants/index";
import { Link, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RAnalyser" },
    { name: "description", content: "Find your dream job" },
  ];
}

export default function Home() {
  const [loadingResumes, setLoadingResumes] = useState(false);
   const { auth, kv } = usePuterStore();
    const navigate = useNavigate();

  // Simulate loading (optional)
  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
    setLoadingResumes(true);

    const timer = setTimeout(() => setLoadingResumes(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
     
      <section className="main-section">
        <div className="page-heading py-16">
          <h1 className="text-3xl font-bold">Analyse your Resume with Kumar</h1>
          <h2 className="text-lg text-gray-600">
            In-Depth analysis of your resumes and AI-powered feedback
          </h2>
        </div>

        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" alt="Scanning resume" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold px-6 py-3 rounded-lg shadow-lg"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
