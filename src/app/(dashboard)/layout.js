import Sidebar from "@/components/sidebar";
import { DeviceProvider } from "@/context/device-context";

export default function DashboardLayout({ children }) {
  return (
    <main className="flex h-svh">
      <Sidebar />
      <DeviceProvider>
        <div className="content flex flex-col w-full overflow-y-scroll">
          <div className="fixed top-0 h-full -z-10 w-full bg-muted">
            <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-primary/35 opacity-50 blur-[80px]"></div>
          </div>
          {/* TODO: put the navbar here */}
          {children}
        </div>
      </DeviceProvider>
    </main>
  );
}
