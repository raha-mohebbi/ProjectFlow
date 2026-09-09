const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        <span className="mt-3 text-sm text-gray-500">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loading;