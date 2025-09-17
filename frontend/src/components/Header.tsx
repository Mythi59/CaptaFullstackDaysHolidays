const Header = () => {
  return (
    <>
      <header className="flex w-full h-full p-4 items-center justify-center">
        <p className="w-1/2 grow">🧑🏻‍💻 Marlon Steven Diaz Lopez</p>
        <p className="grow-0">Prueba Tecnica</p>
        <a className="w-1/2 text-right grow">
          <a
            href=""
            className="text-white bg-orange-400 hover:bg-orange-600 p-3 rounded-full shadow-lg shadow-orange-500/50"
          >
            Git
          </a>
        </a>
      </header>
    </>
  );
};

export default Header;
