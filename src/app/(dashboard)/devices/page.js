import Navbar from "@/components/navbar";
import ProjectList from "@/components/projects-list";



export default function Devices({}) {
  return (
    <div >
      <Navbar title="Devices"/>
      <div className="flex h-full flex-1">
        <ProjectList />


        <div className="flex-1 min-h-svh">
          <div className="flex items-center p-6">

            <div className="flex-1 flex items-center gap-2 text-primary">
              <div className="text-5xl font-bold">02</div>
              <div className="text-lg font-medium">All</div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <div className="text-5xl font-bold">01</div>
              <div className="text-lg font-medium">AP</div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <div className="text-5xl font-bold">01</div>
              <div className="text-lg font-medium">CPE</div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <div className="text-5xl font-bold">01</div>
              <div className="text-lg font-medium">4G</div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <div className="text-5xl font-bold">01</div>
              <div className="text-lg font-medium">5G</div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <div className="size-4 rounded-md bg-blue-600" />
                  <span className="text-xs">Devices: 2</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="size-4 rounded-md bg-green-600" />
                  <span className="text-xs">Offline: 0</span>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-2">
                  <div className="size-4 rounded-md bg-orange-600" />
                  <span className="text-xs">Alarm: 2</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="size-4 rounded-md bg-white" />
                  <span className="text-xs">Online: 2</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TODO: Add table here */}
      </div>

    </div>
  );
} 