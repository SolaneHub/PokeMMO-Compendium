const ServerErrorState = ({ error }) => {
  return (
    <div className="flex h-screen items-center justify-center bg-[#121212] font-sans text-slate-200">
      <div className="text-center text-red-400">
        <h2 className="mb-2 text-2xl font-bold">⚠️ Backend Unreachable</h2>
        <p>{error}</p>
        <p className="mt-2 text-sm text-slate-400">
          Run <code className="rounded bg-slate-800 px-1">npm run server</code>{" "}
          in terminal.
        </p>
      </div>
    </div>
  );
};
export default ServerErrorState;
