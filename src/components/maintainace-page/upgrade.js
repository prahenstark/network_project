import React from "react";
import ToggleHeader from "../toggle-header";
import ToggleDisplay from "../toggle-display";
import { Button } from "../ui/button";
import ProjectList from "../projects-list";

function Upgrade() {
  return (
    <div className="flex h-full w-full">
      <ProjectList />

      <ToggleHeader pageName="Upgrade" className="px-6">
        <Button />
        <Button />
        <Button />
      </ToggleHeader>
    </div>
  );
}

export default Upgrade;
