import Sidebar from "@/components/sidebar";


export default function DashboardLayout({children}) {
  return (
    <main className="flex h-svh bg-muted">
      <Sidebar />
      <div className="content flex flex-col w-full overflow-y-scroll">
        {/* TODO: put the navbar here */}
        {children}
      </div>
    </main>
  );
}