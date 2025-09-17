const Form = () => {
  return (
    <>
      <form className="grid grid-cols-5 grid-rows-5 gap-2">
        <label className="col-start-3 row-start-1">Fecha</label>
        <fieldset className="col-start-3 border-2">
          <input type="datetime-local" className="date" />
        </fieldset>
        <label className="col-start-3 row-start-3">Hora</label>
        <fieldset className="col-start-3 border-2">
          <input type="number" className="hora" />
        </fieldset>
        <label className="col-start-3 row-start-5">Dia</label>
        <fieldset className="col-start-3 border-2">
          <input type="number" className="dia" />
        </fieldset>
        <input
          type="submit"
          value="validar"
          className="col-start-3 bg-sky-500 hover:bg-sky-700 rounded-full py-3 px-8 text-white"
        />
      </form>
    </>
  );
};

export default Form;
