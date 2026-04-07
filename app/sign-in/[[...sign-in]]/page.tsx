import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SignInForm } from "@/components/signInForm";

const signInPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1 flex justify-center items-center p-6">
        <SignInForm />
      </main>
      <Footer />
    </div>
  );
};

export default signInPage;
