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
};
