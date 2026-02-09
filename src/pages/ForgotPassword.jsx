import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ForgotPassword = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset Your Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Password reset assistance
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 px-4 py-6 rounded-md">
              <p className="text-sm text-indigo-900 text-center">
                <strong>Note:</strong> Please contact your administrator/Co-ordinator to get your password reset.
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Remember your password? </span>
                <Link
                  to="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </Link>
              </div>

              <div>
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-indigo-600"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
