"use client";
// import { SidebarNavigation } from "../components/sidebar;
import TaskTable from "../components/taskTable";


const Home: React.FC = () => {
  return (
    <div>
      <main className="flex min-h-screen gap-2 dark:bg-gray-800">
        <div className="absolute right-0 top-0 m-4"></div>
        {/* <SidebarNavigation /> */}
        <div className="ml-64 flex-1">
          <TaskTable />
        </div>
      </main>
    </div>
  );
};

export default Home;