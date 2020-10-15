import { connect } from "react-redux";

import { createMapStateToProps } from "store/common";
import { projectListSelectors, projectListActions } from "store/projectList";
import { alertActions } from "store/alert";

import { ProjectList } from "./project-list";

const mapStateToProps = createMapStateToProps((state) => ({
  projects: projectListSelectors.projects(state),
  error: projectListSelectors.error(state),
  fetchStatus: projectListSelectors.status(state),
}));

const mapDispatchToProps = {
  fetchProjects: projectListActions.fetchProjects,
  addAlert: alertActions.alert,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
