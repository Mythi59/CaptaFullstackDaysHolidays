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

let hd = new holidays("CO"); // Colombia

const isHoliday = (date) => {
  const holiday = hd.getHolidays(date.getfullYear());
  return holiday.some((h) => {
    h.date.getDate() === date.getDate() &&
      h.date.getMonth() === date.getMonth() &&
      h.date.getFullYear() === date.getFullYear();
  });
};

const isBusinessDay = (date) => {
  const day = date.getDate();
  const isWeekend = day === 0 || day === 6;

  return !isWeekend && !isHoliday(date);
};

const isBusinessHour = (date) => {
  const hours = date.getHours();
  return hours >= 8 && hours < 17;
};

const calculateBusinessDate = (baseDate, addDays, addHours) => {
  const result = new Date(baseDate);
  const adjustments = [];

  console.log(`📅 Calculando desde: ${result.toISOString()}`);
  console.log(`➕ Agregar: ${addDays} días, ${addHours} horas`);

  if (addDays > 0) {
    let daystoAdd = addDays;
    let totalDaysAdded = 0;

    while (daystoAdd > 0) {
      result.setDate(result.getDate() + 1);
      totalDaysAdded++;

      if (isBusinessDay(result)) {
        daystoAdd--;
        console.log(`✅ Día hábil encontrado: ${result.toISOString()}`);
      } else {
        console.log(`❌ Dia no habil saltado: ${result.toISOString()}`);
      }
    }

    adjustments.push(
      `Agregados ${addDays} días hábiles (${totalDaysAdded} días calendario)`
    );
  }

  if (addHours > 0) {
    result.setHours(result.getHours() + addHours);
  }

  let finalAdjustment = 0;

  while (!isBusinessDay(result)) {
    result.setDate(result.getDate() + 1);
    finalAdjustment++;
    console.log(`🔄 Ajustando día no hábil: ${result.toDateString()}`);
  }

  if (finalAdjustment > 0) {
    adjustments.push(
      `Movido ${finalAdjustment} día(s) adicional(es) por festivos/fines de semana`
    );
  }

  if (!isBusinessHour(result)) {
    const hours = result.getHours();

    if (hours < 8) {
      result.setHours(8, 0, 0, 0);
      adjustments.push("Ajustado a las 8:00 AM");
      console.log(`⏰ Ajustado a las 8:00 AM: ${result.toISOString()}`);
    }
  } else if (hours >= 17) {
    result.setDate(result.getDate() + 1);
    result.setHours(8, 0, 0, 0);

    let bussinessDayAdjustment = 0;
    while (!isBusinessDay(result)) {
      result.setDate(result.getDate() + 1);
      bussinessDayAdjustment++;
    }

    if (bussinessDayAdjustment > 0) {
      adjustments.push(
        `Movido al siguiente dia habil a las 8:00 AM (fuera del horario laboral + ${bussinessDayAdjustment} días no habiles)`
      );
    } else {
      adjustments.push(
        "Movido al siguiente dia habil a las 8:00 AM (fuera del horario laboral)"
      );
    }
    console.log(
      `⏰ Ajustado al siguiente día hábil a las 8:OO AM (hora tardia)`
    );
  }

  console.log(`Resultado final 📅: ${result.toISOString()}`);

  return { businessDate: result, adjustments };
};

// endpoint to calculate business date
app.post("/api/calculate-business-date", (req, res) => {
  try {
    const { baseDate, addDays, addHours } = req.body;
    console.log(`Nueva solicitud: ${(baseDate, addDays, addHours)}`);

    if (!baseDate) {
      return res.status(400).json({
        success: false,
        error: "La fecha base es requerida",
        message: "Debe proporcionar una fecha en base formato ISO",
      });
    }

    if (typeof addDays !== "number" || addDays < 0) {
      return res.status(400).json({
        success: false,
        error: "Días a agregar inválidos",
        message: 'El valor de "días a agregar" debe ser un número positivo',
      });
    }

    if (typeof addHours !== "number" || addHours < 0) {
      return res.status(400).json({
        success: false,
        error: "Horas a agregar inválidas",
        message: 'El valor de "horas a agregar" debe ser un número positivo',
      });
    }

    const parsedDate = new Date(baseDate);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Fecha base inválida",
        message: "La fecha base proporcionada no es válida.",
      });
    }

    const calculation = calculateBusinessDate(parsedDate, addDays, addHours);

    const response = {
      success: true,
      originalDate: baseDate,
      businessDate: calculation.businessDate.toISOString(),
      adjustments: calculation.adjustments,
      metadata: {
        originalDayOfWeek: parsedDate.toLocaleDateString("es-CO", {
          weekday: "long",
        }),
        resultDayOfWeek: calculation.businessDate.toLocaleDateString("es-CO", {
          weekday: "long",
        }),
        isOriginalHoliday: isHoliday(parsedDate),
        isResultBusinessDay: isBusinessDay(calculation.businessDate),
        businessHoursOriginal: isBusinessHour(parsedDate),
        businessHoursResult: isBusinessHour(calculation.businessDate),
      },
    };

    console.log("Respuesta enviada:", response);
    return res.json(response);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "Ocurrió un error al procesar la solicitud",
    });
  }
});

app.use("*", (req, res) => {
  console.log(`Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada",
    message: `La ruta ${req.path} no existe en el servidor.`,
    avaliableEndpoints: ["POST /api/calculate-business-date"],
  });
});

app.use((err, req, res, next) => {
  console.error("Error inesperado:", err);
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
    message: "Ocurrió un error inesperado en el servidor",
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
