import { existsSync, readdirSync } from "fs";
import { join } from "path";

(function enforceLockstepVersioning() {
  // Inspect `node_modules` local to this package (if it exists). We expect not
  // to see any federation packages in here. If we do, it probably means the
  // user has installed one of the internal federation packages to their repo
  // AND hasn't updated the version.
  const localNodeModules = join(__dirname, '..', 'node_modules');
  if (existsSync(localNodeModules)) {
    const localFederationPackages = readdirSync(localNodeModules).filter(
      (dir) =>
        [
          '@apollo/composition',
          '@apollo/federation-internals',
          '@apollo/query-planner',
        ].includes(dir),
    );
    if (localFederationPackages.length > 0) {
      throw Error(
        `Found unexpected local federation packages in ${localNodeModules}. ` +
          `This probably means you have installed one of the internal federation packages ` +
          `to your repo and didn't update it in lockstep with . Please update the version of ${localFederationPackages.join(
            ', ',
          )} to the latest version.`,
      );
    }
  }

})();
