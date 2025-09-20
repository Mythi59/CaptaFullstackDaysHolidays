const express = require("express");
const cors = require("cors");
let holidays = require("date-holidays");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const hd = new holidays("CO"); // Colombia

const toColombiaTime = () => {
  const now = new Date();
  const colombiaTime = new Date(now.getTime() - 5 * 60 * 60 * 1000);
  return colombiaTime;
};

const toUTC = (colombiaDate) => {
  return new Date(colombiaDate.getTime() + 5 * 60 * 60 * 1000);
};

const isHoliday = (date) => {
  try {
    const holidays = hd.getHolidays(date.getFullYear());
    return holidays.some((h) => {
      const holidayDate = new Date(h.date);
      return (
        holidayDate.getDate() === date.getDate() &&
        holidayDate.getMonth() === date.getMonth() &&
        holidayDate.getFullYear() === date.getFullYear()
      );
    });
  } catch (error) {
    console.error("Error checking holiday:", error);
    return false;
  }
};

const isBusinessDay = (date) => {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // domingo=0, sábado=6
  return !isWeekend && !isHoliday(date);
};

const isBusinessHours = (colombiaTime) => {
  const hours = colombiaTime.getHours();
  return hours >= 8 && hours < 17; // 8:00 AM a 4:59 PM
};

const calculateBusinessDate = (baseDate, addDays, addHours) => {
  // Trabajar en hora de Colombia
  let result = toColombiaTime(new Date(baseDate));
  const adjustments = [];

  console.log(`Calculando desde (Colombia): ${result.toISOString()}`);
  console.log(`Agregar: ${addDays} días, ${addHours} horas`);

  // PASO 1: Agregar días hábiles
  if (addDays > 0) {
    let daysToAdd = addDays;
    let totalDaysAdded = 0;

    while (daysToAdd > 0) {
      result.setDate(result.getDate() + 1);
      totalDaysAdded++;

      if (isBusinessDay(result)) {
        daysToAdd--;
        console.log(`Día hábil encontrado: ${result.toDateString()}`);
      } else {
        console.log(`Día no hábil saltado: ${result.toDateString()}`);
      }
    }

    adjustments.push(`Agregados ${addDays} días hábiles`);
  }

  // PASO 2: Agregar horas
  if (addHours > 0) {
    result.setHours(result.getHours() + addHours);
    adjustments.push(`Agregadas ${addHours} horas`);
  }

  // PASO 3: Ajustar si el resultado NO es día hábil
  while (!isBusinessDay(result)) {
    result.setDate(result.getDate() + 1);
    console.log(`Moviendo a día hábil: ${result.toDateString()}`);
  }

  // PASO 4: Ajustar horario laboral
  const currentHour = result.getHours();

  if (currentHour < 8) {
    // Antes de las 8 AM -> Ajustar a las 8 AM del mismo día
    result.setHours(8, 0, 0, 0);
    adjustments.push("Ajustado a las 8:00 AM (horario laboral)");
    console.log("Ajustado a 8:00 AM");
  } else if (currentHour >= 17) {
    // Después de las 5 PM -> Mover al siguiente día hábil a las 8 AM + las horas que se pasaron
    const horasExcedidas = currentHour - 17;
    const minutosExcedidos = result.getMinutes();

    // Mover al siguiente día hábil
    result.setDate(result.getDate() + 1);
    while (!isBusinessDay(result)) {
      result.setDate(result.getDate() + 1);
    }

    // Establecer a las 8 AM + horas excedidas
    result.setHours(8 + horasExcedidas, minutosExcedidos, 0, 0);

    // Si las horas excedidas nos sacan del horario laboral otra vez, ajustar
    if (result.getHours() >= 17) {
      // Calcular cuántas horas laborales son
      const horasLaboralesCompletas = Math.floor((result.getHours() - 8) / 9); // 9 horas laborales por día
      const horasRestantes = (result.getHours() - 8) % 9;

      // Agregar días completos si es necesario
      if (horasLaboralesCompletas > 0) {
        for (let i = 0; i < horasLaboralesCompletas; i++) {
          result.setDate(result.getDate() + 1);
          while (!isBusinessDay(result)) {
            result.setDate(result.getDate() + 1);
          }
        }
      }

      result.setHours(8 + horasRestantes, minutosExcedidos, 0, 0);
    }

    adjustments.push(
      "Movido al siguiente día hábil (fuera del horario laboral)"
    );
    console.log("Movido al siguiente día hábil");
  }

  // Verificar una vez más que es día hábil
  while (!isBusinessDay(result)) {
    result.setDate(result.getDate() + 1);
    console.log(`🔄 Ajuste final a día hábil: ${result.toDateString()}`);
  }

  console.log(`🎯 Resultado final (Colombia): ${result.toISOString()}`);

  // Convertir de vuelta a UTC para la respuesta
  const resultUTC = toUTC(result);
  console.log(`🌍 Resultado final (UTC): ${resultUTC.toISOString()}`);

  return {
    businessDate: resultUTC,
    businessDateColombia: result,
    adjustments,
  };
};

// ================================
// ENDPOINTS DE LA API
// ================================

/**
 * POST /api/calculate-business-date
 * Endpoint principal para calcular fechas hábiles
 */
app.post("/api/calculate-business-date", (req, res) => {
  try {
    const { baseDate, addDays, addHours } = req.body;

    console.log("Nueva solicitud:", { baseDate, addDays, addHours });

    // Validaciones
    if (!baseDate) {
      return res.status(400).json({
        success: false,
        error: "La fecha base es requerida",
        message: "Debe proporcionar una fecha base en formato ISO",
      });
    }

    if (typeof addDays !== "number" || addDays < 0) {
      return res.status(400).json({
        success: false,
        error: "Días inválidos",
        message: "Los días a agregar deben ser un número positivo o cero",
      });
    }

    if (typeof addHours !== "number" || addHours < 0) {
      return res.status(400).json({
        success: false,
        error: "Horas inválidas",
        message: "Las horas a agregar deben ser un número positivo o cero",
      });
    }

    const parsedDate = new Date(baseDate);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Fecha inválida",
        message: "La fecha proporcionada no es válida",
      });
    }

    // Calcular la fecha hábil
    const calculation = calculateBusinessDate(parsedDate, addDays, addHours);
    const parsedDateColombia = toColombiaTime(parsedDate);

    const response = {
      success: true,
      originalDate: baseDate,
      originalDateColombia: calculation.businessDateColombia.toISOString(),
      businessDate: calculation.businessDate.toISOString(),
      businessDateColombia: calculation.businessDateColombia.toISOString(),
      adjustments: calculation.adjustments,
      metadata: {
        originalDayOfWeek: parsedDateColombia.toLocaleDateString("es-CO", {
          weekday: "long",
        }),
        resultDayOfWeek: calculation.businessDateColombia.toLocaleDateString(
          "es-CO",
          {
            weekday: "long",
          }
        ),
        isOriginalHoliday: isHoliday(parsedDateColombia),
        isResultBusinessDay: isBusinessDay(calculation.businessDateColombia),
        businessHoursOriginal: isBusinessHours(parsedDateColombia),
        businessHoursResult: isBusinessHours(calculation.businessDateColombia),
        timezone: "America/Bogota (UTC-5)",
      },
    };

    console.log("✅ Respuesta enviada");
    return res.json(response);
  } catch (error) {
    console.error("❌ Error al procesar la solicitud:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "Ocurrió un error al procesar la solicitud",
    });
  }
});

/**
 * GET /api/holidays/:year
 * Obtiene todos los festivos de un año
 */
app.get("/api/holidays/:year", (req, res) => {
  try {
    const year = parseInt(req.params.year);

    console.log(`Consultando festivos del año: ${year}`);

    if (isNaN(year) || year < 1000 || year > 3000) {
      return res.status(400).json({
        success: false,
        error: "Año inválido",
        message: "El año debe ser un número válido entre 1000 y 3000",
      });
    }

    const holidays = hd.getHolidays(year);

    const response = {
      success: true,
      year,
      country: "Colombia 🇨🇴",
      timezone: "America/Bogota (UTC-5)",
      count: holidays.length,
      holidays: holidays
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((holiday) => {
          const date = new Date(holiday.date);
          return {
            date: date.toISOString().split("T")[0],
            name: holiday.name,
            type: holiday.type || "public",
            dayOfWeek: date.toLocaleDateString("es-CO", { weekday: "long" }),
            month: date.toLocaleDateString("es-CO", { month: "long" }),
            day: date.getDate(),
            fullDate: date.toLocaleDateString("es-CO", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          };
        }),
    };

    console.log(`Encontrados ${holidays.length} festivos para ${year}`);
    res.json(response);
  } catch (error) {
    console.error("Error getting holidays:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "Ocurrió un error al obtener los días festivos",
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("\n🚀 ===================================");
  console.log("🎉 SERVIDOR DE FECHAS HÁBILES INICIADO");
  console.log("🚀 ===================================");
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📅 API Endpoints disponibles:`);
  console.log(`   🧮 Calcular fechas: POST /api/calculate-business-date`);
  console.log(`   🎉 Ver festivos: GET /api/holidays/:year`);
  console.log("🚀 ===================================");
  console.log(`⏰ Horario laboral: 8:00 AM - 5:00 PM (Colombia UTC-5)`);
  console.log(`📅 Días hábiles: Lunes - Viernes`);
  console.log(`🎉 Festivos: Colombia (date-holidays)`);
  console.log("🚀 ===================================\n");
});
