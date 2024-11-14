import Image from "next/image";

const AuthLayout = ({children}) => {

  return (
    <div className="font-primary flex gap-0">
      {/* Left section (renders child routes via <Outlet />) */}
      <div className="w-full lg:w-1/3">
        {children}
      </div>

      {/* Right section (static image and text) */}
      <div className="w-2/3 hidden lg:grid h-dvh place-content-center sticky top-0 right-0">
        <Image
          src="/assets/authBG.jpg"
          alt="Auth Background"
          height={100}
          width={100}
          className="w-full h-full object-cover object-center absolute inset-0"
        />
        <div className="bg-white/5 backdrop-blur-sm border leading-[1.2] border-white/50 rounded-md text-white py-8 relative max-w-[600px] p-4 text-5xl text-center">
          Seamless Connectivity, Unmatched Control
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;