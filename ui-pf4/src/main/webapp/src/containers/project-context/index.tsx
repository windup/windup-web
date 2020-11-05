import { connect } from "react-redux";

import { ProjectContext } from "./project-context";

import { createMapStateToProps } from "../../store/common";
import {
  projectContextSelectors,
  projectContextActions,
} from "store/projectContext";

const mapStateToProps = createMapStateToProps((state) => ({
  projects: projectContextSelectors.projects(state),
}));

const mapDispatchToProps = {
  fetchProjects: projectContextActions.fetchProjectsContext,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectContext);
