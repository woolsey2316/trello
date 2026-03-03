const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const LoginPage = () => (
  <div className="min-h-screen bg-blue-700 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 w-80">
      <h1 className="text-2xl font-bold text-gray-800">Trello</h1>
      <p className="text-gray-500 text-sm text-center">
        Sign in to manage your boards
      </p>
      <a
        href={`${API}/api/auth/google`}
        className="flex items-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg px-5 py-3 shadow-sm w-full justify-center"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Sign in with Google
      </a>
    </div>
  </div>
);

export default LoginPage;
