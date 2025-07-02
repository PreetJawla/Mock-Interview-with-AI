import React from 'react';
import { Mic, Brain, Award, Code } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">TechInterviewAI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Code className="h-4 w-4" />
              <span className="text-sm">Technical Questions</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Mic className="h-4 w-4" />
              <span className="text-sm">Voice Recognition</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Award className="h-4 w-4" />
              <span className="text-sm">AI Feedback</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;