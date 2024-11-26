import React, { Suspense } from "react";
import Tasks from "../components/tasks";
import Loading from "../app/loading"; // Adjust the import path as needed

const Home: React.FC = () => {
  return (
    <div>
      <main className="flex min-h-screen gap-2 dark:bg-gray-800">
        <div className="absolute right-0 top-0 m-4" />
        {/* <SidebarNavigation /> */}
        <div className="ml-64 flex-1">
          <Suspense fallback={<Loading />}>
            <Tasks />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default Home;