import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-6">QuizMenti</h1>
        <p className="text-lg text-gray-600 mb-12">
          Create and participate in interactive quizzes effortlessly.
        </p>

        
        <div className="grid md:grid-cols-2 gap-8">
        
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">For Users</h2>
            <p className="text-gray-600 mb-6">
              Sign up or sign in to join exciting quizzes.
            </p>
            <Link
              to="/users/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
            >
              Get Started
            </Link>
          </div>

          {/* Admin Signup/Signin */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">For Admins</h2>
            <p className="text-gray-600 mb-6">
              Sign up or sign in to create and manage quizzes.
            </p>
            <Link
              to="/admin/signup"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 inline-block"
            >
              Start Creating
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;