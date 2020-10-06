import { connect } from "react-redux";

import { createMapStateToProps } from "store/common";
import { projectListSelectors, projectListActions } from "store/projectList";
import { deleteDialogActions } from "store/deleteDialog";
import { alertActions } from "store/alert";

import { ProjectList } from "./project-list";

const mapStateToProps = createMapStateToProps((state) => ({
  projects: projectListSelectors.projects(state),
  error: projectListSelectors.error(state),
  fetchStatus: projectListSelectors.status(state),
}));

const mapDispatchToProps = {
  fetchProjects: projectListActions.fetchProjects,
  showDeleteDialog: deleteDialogActions.openModal,
  closeDeleteDialog: deleteDialogActions.closeModal,
  processingDeleteDialog: deleteDialogActions.processing,
  addAlert: alertActions.alert,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
