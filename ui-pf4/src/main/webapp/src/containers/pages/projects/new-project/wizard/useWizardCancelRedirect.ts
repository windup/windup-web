import { useCallback } from "react";

import { MigrationProject } from "models/api";
import { Paths } from "Paths";

export const useWizardCancelRedirect = () => {
  const redirect = useCallback((push: (path: string) => void) => {
    push(Paths.projects);
  }, []);

  const deleteProjectFn = useCallback(
    (push: (path: string) => void, migrationProject?: MigrationProject) => {
      redirect(push);
      // if (migrationProject) {
      //   deleteProject(migrationProject)
      //     .then(() => {
      //       redirect(push);
      //     })
      //     .catch((error: AxiosError) => {
      //       console.log("Could not clear project", error.response);
      //       redirect(push);
      //     });
      // } else {
      //   redirect(push);
      // }
    },
    [redirect]
  );

  return deleteProjectFn;
};
