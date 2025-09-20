import { useState } from "react";
import type { FormData } from "../models/FormData";
import type { ApiResponse } from "../models/ApiResponse";
import type { FormErrors } from "../models/FormErrors";

const Form: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    baseDate: new Date().toISOString().split("T")[0],
    baseTime: new Date().toTimeString().slice(0, 5),
    addDays: 0,
    addHours: 0,
  });

  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.baseDate) {
      newErrors.baseDate = "La fecha es obligatoria";
    }

    if (!formData.baseTime) {
      newErrors.baseTime = "La hora es obligatoria";
    }

    if (formData.addDays !== undefined && formData.addDays < 0) {
      newErrors.addDays = "Ingresa un número válido de días (O o más)";
    }

    if (formData.addHours !== undefined && formData.addHours < 0) {
      newErrors.addHours = "Ingresa un número válido de horas (O o más)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setResult(null);

    try {
      const baseDateTime = new Date(
        `${formData.baseDate}T${formData.baseTime}Z`
      );
      const isoDate = baseDateTime.toISOString();

      const response = await fetch(
        "http://localhost:3001/api/calculate-business-date",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            baseDate: isoDate,
            addDays: parseInt(formData.addDays.toString()),
            addHours: parseInt(formData.addHours.toString()),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setErrors({ submit: data.message || "Error en el servidor" });
      }
    } catch (error) {
      setErrors({ submit: `Error en la conexion con el servidor: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      baseDate: new Date().toISOString().split("T")[0],
      baseTime: new Date().toTimeString().slice(0, 5),
      addDays: 0,
      addHours: 0,
    });
    setErrors({});
    setResult(null);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Calculadora de Fechas Hábiles
          </h1>
          <p className="text-gray-600">
            Calcula fechas considerando días festivos y horarios laborales en
            Colombia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.baseDate}
                onChange={(e) => handleInputChange("baseDate", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                  errors.baseDate
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
              />
              {errors.baseDate && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  {errors.baseDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.baseTime}
                onChange={(e) => handleInputChange("baseTime", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                  errors.baseTime
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
              />
              {errors.baseTime && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  {errors.baseTime}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días a agregar
              </label>
              <input
                type="number"
                min="0"
                value={formData.addDays || 0}
                onChange={(e) => handleInputChange("addDays", e.target.value)}
                placeholder="Ej: 2"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                  errors.addDays
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
              />
              {errors.addDays && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  {errors.addDays}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horas a agregar
              </label>
              <input
                type="number"
                min="0"
                value={formData.addHours || 0}
                onChange={(e) => handleInputChange("addHours", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                  errors.addHours
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                }`}
              />
              {errors.addHours && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  {errors.addHours}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-400 text-white py-3 px-6 rounded-lg hover:bg-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Validando...
                </>
              ) : (
                <>Validar</>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
            >
              Limpiar Campos
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
            >
              Usar fecha y hora actual
            </button>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 flex items-center">{errors.submit}</p>
            </div>
          )}
        </form>

        {result && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-semibold text-green-800">
                Resultado Calculado
              </h2>
            </div>

            <div className="space-y-4 text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <span className="font-medium text-gray-800">
                    Fecha original:
                  </span>
                  <p className="text-lg mt-1">
                    {new Date(result.originalDate).toLocaleDateString("es-CO", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {result.metadata.isOriginalHoliday
                      ? "Día festivo"
                      : "Día regular"}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <span className="font-medium text-gray-800">
                    Fecha calculada:
                  </span>
                  <p className="text-lg mt-1 text-blue-600 font-semibold">
                    {new Date(result.businessDate).toLocaleString("es-CO", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {result.metadata.isResultBusinessDay
                      ? "Día hábil"
                      : "Día no hábil"}
                  </p>
                </div>
              </div>

              {result.adjustments && result.adjustments.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <span className="font-medium text-blue-800">
                    Ajustes realizados:
                  </span>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    {result.adjustments.map((adjustment, index) => (
                      <li key={index} className="text-blue-700">
                        {adjustment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            Consultar Días Festivos
          </h3>
          <p className="text-yellow-700 text-sm mb-4">
            Consulta los días festivos oficiales de Colombia para cualquier año
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-yellow-700 mb-2">
                Año a consultar:
              </label>
              <input
                type="number"
                min="2020"
                max="2030"
                defaultValue={new Date().getFullYear()}
                id="holidays-year"
                className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const yearInput = document.getElementById(
                  "holidays-year"
                ) as HTMLInputElement;
                const year = parseInt(yearInput.value);
                window.open(
                  `http://localhost:3001/api/holidays/${year}`,
                  "_blank"
                );
              }}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-200 flex items-center"
            >
              Ver Festivos en Nueva Pestaña
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
