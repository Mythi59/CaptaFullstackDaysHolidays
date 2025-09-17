const Form: React.FC = () => {
  return (
    <>
      <form className="grid grid-cols-5 grid-rows-5 gap-2">
        <fieldset className="col-start-3 rounded-2xl">
          <div className="mb-3">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="date"
            >
              Fecha<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="Date"
              value={new Date().toISOString().split("T")[0]}
            />
          </div>
        </fieldset>
        <fieldset className="col-start-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dia
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </fieldset>
        <fieldset className="col-start-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora
          </label>
          <input
            type="number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </fieldset>
        <fieldset className="col-start-3">
          <div className="mb-3">
            <input
              type="submit"
              value="validar"
              className="bg-slate-400 hover:bg-slate-500 rounded-full py-3 px-8 text-white"
            />
          </div>
        </fieldset>
      </form>
    </>
  );
};

export default Form;
