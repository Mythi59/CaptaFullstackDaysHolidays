// Agrega este componente a tu Form.tsx o crea un archivo separado
import React, { useState } from "react";

interface Holiday {
  date: string;
  name: string;
  type: string;
  dayOfWeek: string;
  month: string;
  day: number;
  fullDate: string;
}

interface HolidaysResponse {
  success: boolean;
  year: number;
  country: string;
  count: number;
  holidays: Holiday[];
}

const HolidaysViewer: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [showHolidays, setShowHolidays] = useState(false);

  const fetchHolidays = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3001/api/holidays/${selectedYear}`
      );
      const data: HolidaysResponse = await response.json();

      if (response.ok && data.success) {
        setHolidays(data.holidays);
        setShowHolidays(true);
      } else {
        setError("Error al obtener los festivos");
      }
    } catch (error) {
      setError("Error de conexión con el servidor: " + error);
    } finally {
      setLoading(false);
    }
  };

  const closeHolidays = () => {
    setShowHolidays(false);
    setHolidays([]);
  };

  return (
    <div className="mt-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          🎉 Consultar Días Festivos
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Año a consultar:
            </label>
            <input
              type="number"
              min="2020"
              max="2030"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchHolidays}
            disabled={loading}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-yellow-300 disabled:cursor-not-allowed transition duration-200 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Consultando...
              </>
            ) : (
              <>🔍 Ver Festivos</>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-3 text-red-600 text-sm flex items-center">
            ❌ {error}
          </div>
        )}
      </div>

      {showHolidays && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header del modal */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    🎉 Días Festivos {selectedYear}
                  </h2>
                  <p className="text-yellow-100 mt-1">
                    Colombia 🇨🇴 - Total: {holidays.length} días festivos
                  </p>
                </div>
                <button
                  onClick={closeHolidays}
                  className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition duration-200"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {holidays.map((holiday, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg mb-1">
                          {holiday.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          📅 {holiday.fullDate}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="bg-yellow-200 px-2 py-1 rounded-full">
                            {holiday.type === "public"
                              ? "🎉 Público"
                              : "📋 Otro"}
                          </span>
                          <span>📅 {holiday.date}</span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center font-bold text-yellow-700">
                          {holiday.day}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  ℹ️ Información:
                </h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Los días festivos mostrados son oficiales de Colombia</p>
                  <p>
                    • La calculadora de fechas hábiles considera automáticamente
                    estos días
                  </p>
                  <p>
                    • Los festivos que caen en fin de semana pueden trasladarse
                    al lunes siguiente
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={closeHolidays}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidaysViewer;
