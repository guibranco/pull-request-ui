import React from 'react';
import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-700 mt-auto py-8">
      <div className="container mx-auto px-6 lg:px-8 max-w-[90rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center justify-center md:justify-start space-x-6">
            <a
              href="https://guilherme.stracini.com.br/?utm_campaign=project&utm_media=GitHub+Pages&utm_source=pull-requests-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 group"
            >
              <div className="relative w-[27px] h-[50px]">
                <img
                  alt="Guilherme Branco Stracini"
                  className="absolute inset-0 w-full h-full object-cover rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                  loading="lazy"
                  src="https://guilherme.stracini.com.br/photo.png"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">
                  Developed with{' '}
                  <Heart className="w-4 h-4 inline text-red-500 animate-pulse" />{' '}
                  by
                </span>
                <span className="text-lg font-medium text-gray-200 group-hover:text-primary transition-colors">
                  Guilherme Branco Stracini
                </span>
              </div>
            </a>
          </div>

          <div className="flex items-center justify-center md:justify-end">
            <a
              href="https://github.com/guibranco/pull-request-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-gray-400 hover:text-primary transition-colors group"
            >
              <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col items-start">
                <span className="text-sm">View on</span>
                <span className="font-medium">GitHub</span>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Pull Request Flow Viewer. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
