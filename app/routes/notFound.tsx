// routes/notFound.tsx
import { useNavigate } from "react-router";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl mb-6">Oops! Page Not Found</h2>
            <p className="mb-6">The page you are looking for doesn’t exist.</p>
            <button
                className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => navigate('/')}
            >
                Go Back Home
            </button>
        </main>
    );
}
