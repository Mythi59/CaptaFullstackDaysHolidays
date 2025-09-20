const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información del proyecto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              📅 Calculadora de Fechas Hábiles
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Sistema completo para calcular fechas hábiles considerando días
              festivos de Colombia y horarios laborales estándar (8:00 AM - 5:00
              PM).
            </p>
          </div>

          {/* Características */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🚀 Características</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li className="flex items-center">
                <span className="mr-2">✅</span>
                Días festivos colombianos actualizados
              </li>
              <li className="flex items-center">
                <span className="mr-2">✅</span>
                Cálculo automático de días hábiles
              </li>
              <li className="flex items-center">
                <span className="mr-2">✅</span>
                Ajuste de horarios laborales
              </li>
              <li className="flex items-center">
                <span className="mr-2">✅</span>
                API RESTful completa
              </li>
            </ul>
          </div>

          {/* Tecnologías */}
          <div>
            <h3 className="text-lg font-semibold mb-4">🛠️ Tecnologías</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                React
              </span>
              <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-medium">
                TypeScript
              </span>
              <span className="bg-green-600 px-3 py-1 rounded-full text-xs font-medium">
                Node.js
              </span>
              <span className="bg-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                Express
              </span>
              <span className="bg-cyan-600 px-3 py-1 rounded-full text-xs font-medium">
                Tailwind CSS
              </span>
            </div>

            <div className="mt-4">
              <p className="text-gray-400 text-xs">
                📊 API Endpoints: 6 disponibles
              </p>
              <p className="text-gray-400 text-xs">
                🎯 Precisión: 100% festivos colombianos
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              © {currentYear} Marlon Steven Díaz López. Desarrollado para prueba
              técnica.
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-xs text-gray-500">Hecho con</span>
              <span className="text-red-500">❤️</span>
              <span className="text-xs text-gray-500">en Colombia</span>
              <span className="text-yellow-500">🇨🇴</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
