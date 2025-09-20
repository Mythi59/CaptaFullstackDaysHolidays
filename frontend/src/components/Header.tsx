const Header = () => {
  return (
    <header className="bg-gray-800 text-white mb-16">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">🧑🏻‍💻</div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Marlon Steven Díaz López
              </h1>
              <p className="text-sm text-gray-300">Desarrollador Full Stack</p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-1">
              Prueba Técnica
            </h2>
            <p className="text-sm text-gray-300">
              Calculadora de Fechas Hábiles - Colombia
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Mythi59"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </a>

            <div className="hidden md:block w-px h-8 bg-gray-100"></div>

            <div className="text-right">
              <p className="text-xs text-gray-300">Stack Técnico</p>
              <p className="text-sm font-medium text-white">
                React + TypeScript + Node.js
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
